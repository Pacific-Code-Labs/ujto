import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApiError, createUpload, deleteTranscription, startUpload, uploadToStorage } from "@/lib/api";
import type { Transcription } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

// Browsers leave File.type empty for some containers; fall back to the extension.
const EXTENSION_TYPES: Record<string, string> = {
  mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg",
  oga: "audio/ogg", opus: "audio/opus", flac: "audio/flac", weba: "audio/webm",
  mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm",
  mkv: "video/x-matroska", avi: "video/x-msvideo", mpeg: "video/mpeg", mpg: "video/mpeg",
};

function mediaType(file: File): string | null {
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[ext] ?? null;
}

/** Read the duration from the file's metadata; undefined when the browser cannot tell. */
function probeDuration(file: File, type: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    const el = document.createElement(type.startsWith("video/") ? "video" : "audio");
    const url = URL.createObjectURL(file);
    const done = (value?: number) => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(value !== undefined && Number.isFinite(value) ? value : undefined);
    };
    const timer = setTimeout(() => done(), 5000);
    el.preload = "metadata";
    el.onloadedmetadata = () => done(el.duration);
    el.onerror = () => done();
    el.src = url;
  });
}

type Phase = "idle" | "uploading" | "starting";

interface Props {
  userId: string;
  maxUploadBytes: number;
  maxVideoSeconds: number;
  disabled?: boolean;
  onQueued: (transcription: Transcription) => void;
  onError: (message: string) => void;
}

/** Upload a local audio/video file straight to storage, then queue it for transcription. */
export function UploadTranscriptionForm({ userId, maxUploadBytes, maxVideoSeconds, disabled, onQueued, onError }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const maxMb = Math.floor(maxUploadBytes / (1024 * 1024));
  const maxMinutes = Math.floor(maxVideoSeconds / 60);
  const fill = (key: string) =>
    t(key).replace("{{size}}", String(maxMb)).replace("{{minutes}}", String(maxMinutes));
  const busy = phase !== "idle";

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!mediaType(picked)) return onError(t("upload.errors.notMedia"));
    if (picked.size > maxUploadBytes) return onError(fill("upload.errors.tooBig"));
    setFile(picked);
  };

  const submit = async () => {
    if (!file) return;
    const type = mediaType(file)!;
    const duration = await probeDuration(file, type);
    if (duration !== undefined && duration > maxVideoSeconds) return onError(fill("upload.errors.tooLong"));

    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("uploading");
    setProgress(0);
    let reservedId: string | null = null; // job created but not started yet
    try {
      const { transcription, upload } = await createUpload(userId, {
        filename: file.name,
        contentType: type,
        sizeBytes: file.size,
        durationSeconds: duration,
      });
      reservedId = transcription.id;
      await uploadToStorage(upload, file, setProgress, controller.signal);
      setPhase("starting");
      const started = await startUpload(userId, transcription.id);
      reservedId = null;
      onQueued(started);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      // Drop the reserved job (and any partial file) so it does not linger in the history.
      if (reservedId) deleteTranscription(userId, reservedId).catch(() => undefined);
      const message = error instanceof ApiError
        ? error.message === "UPLOAD_CANCELLED"
          ? t("upload.errors.cancelled")
          : error.message === "UPLOAD_FAILED"
            ? t("upload.errors.failed")
            : error.message
        : t("upload.errors.failed");
      onError(message);
    } finally {
      abortRef.current = null;
      setPhase("idle");
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!busy && !disabled) choose(e.dataTransfer.files[0]); }}
        className={cn(
          "w-full rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          "hover:border-primary hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60",
          dragging ? "border-primary bg-muted/50" : "border-muted-foreground/30",
        )}
      >
        {file ? (
          <span className="flex items-center justify-center gap-2 text-sm font-medium min-w-0">
            <Icons.fileAudio className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-2">
            <Icons.upload className="h-8 w-8 text-muted-foreground" aria-hidden />
            <span className="text-sm font-medium">{t("upload.dropTitle")}</span>
            <span className="text-xs text-muted-foreground">{fill("upload.dropHint")}</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        className="hidden"
        onChange={(e) => choose(e.target.files?.[0])}
      />

      {phase === "uploading" && (
        <div className="space-y-1">
          <Progress value={Math.round(progress * 100)} />
          <p className="text-xs text-muted-foreground">
            {t("upload.uploading").replace("{{percent}}", String(Math.round(progress * 100)))}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        {file && !busy && (
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            {t("upload.change")}
          </Button>
        )}
        {phase === "uploading" && (
          <Button type="button" variant="outline" onClick={() => abortRef.current?.abort()}>
            {t("upload.cancel")}
          </Button>
        )}
        <Button type="button" onClick={submit} disabled={!file || busy || disabled}>
          {busy ? (
            <>
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              {phase === "starting" ? t("upload.starting") : t("transcription.processing")}
            </>
          ) : (
            t("upload.start")
          )}
        </Button>
      </div>
    </div>
  );
}

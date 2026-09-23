// Shapes the UI currently consumes (formerly inferred from the server's Drizzle schema).

export interface Transcription {
  id: string;
  userId: string;
  videoUrl: string;
  videoTitle?: string;
  transcript: string;
  status: "pending" | "processing" | "completed" | "failed" | string;
  duration: number;
  wordCount: number;
  processingTime: number;
  accuracy: number;
  errorMessage?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedId: string | null;
  isRead: boolean | null;
  createdAt: Date | null;
}

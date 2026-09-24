import { useState } from "react";
import { Download, Copy, Clock, FileText, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranscriptionResultsProps {
  transcription: {
    id: string;
    transcript: string;
    duration: number;
    wordCount: number;
    processingTime: number;
    accuracy: number;
  };
}

export default function TranscriptionResults({ transcription }: TranscriptionResultsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcription_${transcription.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: t("messages.downloadTitle"),
      description: t("messages.downloadStarted"),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription.transcript);
      toast({
        title: t("messages.copied"),
        description: t("messages.copied"),
      });
    } catch (err) {
      toast({
        title: t("common.error"),
        description: t("messages.copyFailed"),
        variant: "destructive",
      });
    }
  };

  return (
    <section id="results" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t("results.title")}</h3>
              <div className="flex space-x-3">
                <Button onClick={handleDownload} className="bg-primary text-white hover:bg-indigo-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download TXT
                </Button>
                <Button onClick={handleCopy} className="bg-secondary text-white hover:bg-violet-600">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
              </div>
            </div>
            
            {/* Results Display */}
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto mb-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {transcription.transcript}
              </p>
            </div>

            {/* Transcript Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary flex items-center justify-center mb-1">
                  <Clock className="mr-2 h-6 w-6" />
                  {formatDuration(transcription.duration)}
                </div>
                <div className="text-sm text-gray-600">{t("results.duration")}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-accent flex items-center justify-center mb-1">
                  <FileText className="mr-2 h-6 w-6" />
                  {transcription.wordCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{t("results.words")}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-secondary flex items-center justify-center mb-1">
                  <Target className="mr-2 h-6 w-6" />
                  {transcription.accuracy}%
                </div>
                <div className="text-sm text-gray-600">{t("results.accuracy")}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-500 flex items-center justify-center mb-1">
                  <Zap className="mr-2 h-6 w-6" />
                  {transcription.processingTime}s
                </div>
                <div className="text-sm text-gray-600">{t("results.processing")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

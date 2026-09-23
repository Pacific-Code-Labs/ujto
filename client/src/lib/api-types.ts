// Shapes the UI currently consumes (formerly inferred from the server's Drizzle schema).

export interface Transcription {
  id: string;
  userId: string | null;
  videoUrl: string;
  videoTitle: string | null;
  transcript: string | null;
  status: string | null;
  duration: string | null;
  wordCount: number | null;
  processingTime: string | null;
  accuracy: string | null;
  createdAt: Date | null;
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

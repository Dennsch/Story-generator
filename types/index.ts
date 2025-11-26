export interface StoryRequest {
  description: string;
  title?: string;
  targetAudience?: 'children' | 'young-adult' | 'adult';
  length?: 'short' | 'medium' | 'long';
}

export interface StoryResponse {
  success: boolean;
  message: string;
  fileId?: string;
  fileName?: string;
  driveUrl?: string;
  localPath?: string;
  error?: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
  pages: StoryPage[];
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt?: string;
}

export interface GoogleDriveConfig {
  folderId: string;
  serviceAccountKey: string;
}

export interface GeminiConfig {
  apiKey: string;
}

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}
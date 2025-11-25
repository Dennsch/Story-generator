import { google } from 'googleapis';
import { GoogleDriveConfig } from '@/types';

export class GoogleDriveService {
  private drive: any;
  private folderId: string;

  constructor(config: GoogleDriveConfig) {
    this.folderId = config.folderId;
    
    // Parse the service account key
    const serviceAccountKey = JSON.parse(config.serviceAccountKey);
    
    // Create JWT auth client with domain-wide delegation (impersonation)
    const auth = new google.auth.JWT(
      serviceAccountKey.client_email,
      undefined,
      serviceAccountKey.private_key,
      ['https://www.googleapis.com/auth/drive'],
      config.impersonateUser // User email to impersonate
    );

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadPDF(
    pdfBuffer: Buffer,
    fileName: string,
    description?: string
  ): Promise<{ fileId: string; webViewLink: string }> {
    try {
      const { Readable } = require('stream');
      
      const fileMetadata = {
        name: fileName,
        parents: [this.folderId],
        description: description || 'Generated storybook PDF'
      };

      // Convert Buffer to Stream
      const stream = Readable.from(pdfBuffer);

      const media = {
        mimeType: 'application/pdf',
        body: stream
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink',
        supportsAllDrives: true
      });

      // Make the file publicly viewable (optional)
      await this.drive.permissions.create({
        fileId: response.data.id,
        resource: {
          role: 'reader',
          type: 'anyone'
        },
        supportsAllDrives: true
      });

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new Error('Failed to upload PDF to Google Drive');
    }
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      throw new Error('Failed to create folder in Google Drive');
    }
  }

  async listFiles(folderId?: string): Promise<any[]> {
    try {
      const query = folderId ? `'${folderId}' in parents` : undefined;
      
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id,name,mimeType,createdTime,webViewLink)',
        orderBy: 'createdTime desc'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error listing files from Google Drive:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId
      });
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw new Error('Failed to delete file from Google Drive');
    }
  }

  static validateConfig(config: GoogleDriveConfig): void {
    if (!config.folderId) {
      throw new Error('Google Drive folder ID is required');
    }

    if (!config.serviceAccountKey) {
      throw new Error('Google service account key is required');
    }

    try {
      const parsed = JSON.parse(config.serviceAccountKey);
      if (!parsed.client_email || !parsed.private_key) {
        throw new Error('Invalid service account key format');
      }
    } catch (error) {
      throw new Error('Invalid service account key JSON format');
    }
  }
}
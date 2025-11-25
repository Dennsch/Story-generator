import { NextApiRequest, NextApiResponse } from 'next';
import { StoryRequest, StoryResponse } from '@/types';
import { GeminiService } from '@/lib/gemini';
import { PDFGenerator } from '@/lib/pdf-generator';
import { GoogleDriveService } from '@/lib/google-drive';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoryResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Validate environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const googleServiceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured',
        error: 'GEMINI_API_KEY environment variable is missing'
      });
    }

    if (!googleDriveFolderId || !googleServiceAccountKey) {
      return res.status(500).json({
        success: false,
        message: 'Google Drive configuration missing',
        error: 'GOOGLE_DRIVE_FOLDER_ID or GOOGLE_SERVICE_ACCOUNT_KEY environment variable is missing'
      });
    }

    // Validate request body
    const storyRequest: StoryRequest = req.body;
    
    if (!storyRequest.description || storyRequest.description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Story description is required',
        error: 'Please provide a description for the story'
      });
    }

    if (storyRequest.description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Story description too long',
        error: 'Description must be 1000 characters or less'
      });
    }

    // Initialize services
    const geminiService = new GeminiService({ apiKey: geminiApiKey });
    const pdfGenerator = new PDFGenerator();
    const googleDriveService = new GoogleDriveService({
      folderId: googleDriveFolderId,
      serviceAccountKey: googleServiceAccountKey,
      impersonateUser: process.env.GOOGLE_DRIVE_IMPERSONATE_USER
    });

    // Step 1: Generate story content using Gemini
    console.log('Generating story content...');
    const generatedStory = await geminiService.generateStorybook(storyRequest);

    // Step 2: Generate PDF from the story
    console.log('Generating PDF...');
    const pdfBuffer = await pdfGenerator.generatePDF(generatedStory);
    const fileName = pdfGenerator.generateFileName(generatedStory);

    // Step 3: Upload PDF to Google Drive
    console.log('Uploading to Google Drive...');
    const uploadResult = await googleDriveService.uploadPDF(
      pdfBuffer,
      fileName,
      `Generated storybook: ${generatedStory.title}`
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Storybook generated and uploaded successfully',
      fileId: uploadResult.fileId,
      fileName: fileName,
      driveUrl: uploadResult.webViewLink
    });

  } catch (error) {
    console.error('Error in generate-storybook API:', error);
    
    // Determine error type and return appropriate response
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Specific error handling
      if (error.message.includes('Gemini') || error.message.includes('generate')) {
        statusCode = 502;
        errorMessage = 'Failed to generate story content. Please try again.';
      } else if (error.message.includes('PDF')) {
        statusCode = 502;
        errorMessage = 'Failed to generate PDF. Please try again.';
      } else if (error.message.includes('Google Drive') || error.message.includes('upload')) {
        statusCode = 502;
        errorMessage = 'Failed to upload to Google Drive. Please check configuration.';
      }
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
    });
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: false,
  },
}
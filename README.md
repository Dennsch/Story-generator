# 📚 Story Generator

A TypeScript application that generates beautiful storybooks using Google Gemini AI and automatically saves them as PDFs to Google Drive.

## 🚀 Features

- **AI-Powered Story Generation**: Uses Google Gemini AI to create engaging stories
- **PDF Generation**: Converts stories into beautifully formatted PDF storybooks
- **Local Storage**: Saves PDFs locally in the `generated-pdfs/` directory before uploading
- **Google Drive Integration**: Automatically uploads PDFs to your specified Google Drive folder
- **Configurable Parameters**: Customize story length, target audience, and more
- **RESTful API**: Simple POST endpoint for easy integration
- **Vercel Ready**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Next.js** - React framework with API routes
- **Google Gemini AI** - Story content generation
- **Puppeteer** - PDF generation
- **Google Drive API** - Cloud storage
- **Vercel** - Deployment platform

## 📋 Prerequisites

Before setting up the application, you'll need:

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Google Cloud Service Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Drive API
   - Create a service account and download the JSON key file

3. **Google Drive Folder**
   - Create a folder in Google Drive where PDFs will be stored
   - Share the folder with your service account email
   - Note the folder ID from the URL

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd story-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add GOOGLE_DRIVE_FOLDER_ID
   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
   ```

## 📖 API Usage

### Endpoint
```
POST /api/generate-storybook
```

### Request Body
```json
{
  "description": "A story about a brave little mouse",
  "title": "The Adventures of Squeaky",
  "targetAudience": "children",
  "length": "medium"
}
```

### Parameters
- `description` (required): Brief description of the story you want to generate
- `title` (optional): Custom title for the storybook
- `targetAudience` (optional): `"children"`, `"young-adult"`, or `"adult"` (default: `"children"`)
- `length` (optional): `"short"`, `"medium"`, or `"long"` (default: `"medium"`)

### Response
```json
{
  "success": true,
  "message": "Storybook generated and uploaded successfully",
  "fileId": "1ABC123DEF456GHI789JKL",
  "fileName": "the-adventures-of-squeaky-2024-01-15.pdf",
  "driveUrl": "https://drive.google.com/file/d/1ABC123DEF456GHI789JKL/view",
  "localPath": "/path/to/project/generated-pdfs/the-adventures-of-squeaky-2024-01-15.pdf"
}
```

**Note**: PDFs are saved locally in the `generated-pdfs/` directory before being uploaded to Google Drive. This directory is automatically created if it doesn't exist and is excluded from version control.

### Example Usage

#### cURL
```bash
curl -X POST https://your-app.vercel.app/api/generate-storybook \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A magical adventure about a young wizard learning to fly",
    "targetAudience": "children",
    "length": "medium"
  }'
```

#### JavaScript/TypeScript
```typescript
const response = await fetch('/api/generate-storybook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    description: 'A magical adventure about a young wizard learning to fly',
    targetAudience: 'children',
    length: 'medium'
  })
});

const result = await response.json();
console.log(result.driveUrl); // Google Drive link to the PDF
```

## 🔒 Security Notes

- Keep your API keys secure and never commit them to version control
- The Google service account should have minimal permissions (only Google Drive access)
- Consider implementing rate limiting for production use
- Validate and sanitize all user inputs

## 🐛 Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Ensure `GEMINI_API_KEY` is set in your environment variables
   - Verify the API key is valid and has proper permissions

2. **"Google Drive configuration missing"**
   - Check that `GOOGLE_DRIVE_FOLDER_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY` are set
   - Ensure the service account has access to the specified folder

3. **"Failed to generate PDF"**
   - This might be a Puppeteer issue on Vercel
   - Ensure your deployment has sufficient memory allocated

4. **"Failed to upload to Google Drive"**
   - Verify the service account has write permissions to the folder
   - Check that the Google Drive API is enabled in your Google Cloud project

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
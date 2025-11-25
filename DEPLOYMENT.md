# Deployment Guide for Vercel

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional): `npm i -g vercel`
3. Required API keys and credentials:
   - Google Gemini API key
   - Google Drive folder ID
   - Google service account credentials JSON

## Environment Variables Setup

You need to configure these environment variables in Vercel:

### 1. GEMINI_API_KEY
Your Google Gemini API key for story generation.

### 2. GOOGLE_DRIVE_FOLDER_ID
The ID of the Google Drive folder where PDFs will be uploaded.
You can find this in the folder URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`

### 3. GOOGLE_SERVICE_ACCOUNT_KEY
The entire JSON content of your Google service account key file.
This should be the complete JSON object as a string.

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables:
   - Go to Settings → Environment Variables
   - Add each of the three required variables
   - Make sure they're available for Production, Preview, and Development
5. Click "Deploy"

### Method 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add GOOGLE_DRIVE_FOLDER_ID
   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

## Setting Up Google Service Account

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create a service account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name and description
   - Grant it necessary permissions
5. Create a key:
   - Click on the service account
   - Go to Keys tab
   - Add Key → Create new key → JSON
   - Download the JSON file
6. Share your Google Drive folder with the service account email
   - Copy the `client_email` from the JSON file
   - Share your target folder with this email address

## Vercel Configuration

The project includes a `vercel.json` file with:
- Function timeout set to 60 seconds for PDF generation

## Testing Your Deployment

After deployment, test the health endpoint:

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "gemini": "configured",
    "googleDrive": "configured"
  },
  "environment": "production"
}
```

## Testing Story Generation

```bash
curl -X POST https://your-app.vercel.app/api/generate-storybook \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A story about a brave little mouse",
    "targetAudience": "children"
  }'
```

Note: All stories are generated with exactly 25 pages.

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed
- Check that TypeScript compiles without errors: `npm run type-check`

### API Returns 500 Error
- Verify all environment variables are set correctly
- Check Vercel function logs in the dashboard
- Ensure Google service account has access to the Drive folder

### PDF Generation Fails
- The app uses PDFKit instead of Puppeteer for Vercel compatibility
- Check function timeout settings (should be at least 60 seconds)

### Google Drive Upload Fails
- Verify service account email has write access to the folder
- Check that the folder ID is correct
- Ensure the service account key JSON is valid

## Important Notes

- Vercel serverless functions have a maximum execution time (60 seconds on Hobby plan, 300 seconds on Pro plan)
- All stories are generated with exactly 25 pages
- The app uses PDFKit for PDF generation, which is lightweight and Vercel-compatible
- Make sure your Google service account has proper permissions
- Keep your environment variables secure and never commit them to git

# Quick Start Guide

## Setup (2 minutes)

### Share Your Google Drive Folder

Your folder is public, but the service account needs write access:

1. **Go to your folder in Google Drive**
   - Folder ID: `1mlMCQTf1mQKyboVtcROZwa5hrUsrBs57`

2. **Share it with the service account**
   - Right-click → "Share"
   - Add: `storybook-account@storybooks-479300.iam.gserviceaccount.com`
   - Permission: **Editor**
   - Uncheck "Notify people"
   - Click "Share"

3. **Done!** Try generating a story.

## Environment Variables

Your `.env.local` should have:

```bash
GEMINI_API_KEY=AIzaSyC6IgqwaiNfwzogECOuqWa6bRnY4_komPI
GOOGLE_DRIVE_FOLDER_ID=1mlMCQTf1mQKyboVtcROZwa5hrUsrBs57
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

## Test It

1. Run `npm run dev`
2. Open http://localhost:3000
3. Enter a story description
4. Click "Generate Storybook"
5. Check your Google Drive folder for the PDF!

## Deploy to Vercel

See `DEPLOYMENT.md` for deployment instructions.

## Need Help?

- **Setup issues:** See `GOOGLE_DRIVE_SETUP.md`
- **Deployment:** See `DEPLOYMENT.md`

# Google Drive Setup - Simple Method

## Quick Setup (2 minutes)

Your folder is public, so you just need to share it with the service account.

### Step 1: Share Your Folder

1. **Go to Google Drive** at https://drive.google.com

2. **Find your folder** (the one with ID: `1mlMCQTf1mQKyboVtcROZwa5hrUsrBs57`)

3. **Share it with the service account:**
   - Right-click the folder → "Share"
   - Add this email: `storybook-account@storybooks-479300.iam.gserviceaccount.com`
   - Set permission to **"Editor"**
   - **Uncheck "Notify people"** (service accounts don't receive emails)
   - Click "Share"

### Step 2: Test It

That's it! Try generating a story now. The PDF should upload to your folder.

## Troubleshooting

### Error: "Service Accounts do not have storage quota"
- Make sure you shared the folder with the service account email
- The service account needs "Editor" permissions

### Error: "Insufficient permissions"
- Double-check the service account email is correct
- Make sure you gave "Editor" (not just "Viewer") permissions

### Files not appearing
- Verify the folder ID in your `.env.local` is correct
- Check that the service account is listed in the folder's sharing settings

## Your Configuration

**Service Account Email:**
```
storybook-account@storybooks-479300.iam.gserviceaccount.com
```

**Current Folder ID:**
```
1mlMCQTf1mQKyboVtcROZwa5hrUsrBs57
```

**To verify sharing:**
1. Open the folder in Google Drive
2. Click the "Share" button
3. You should see the service account email in the list with "Editor" access

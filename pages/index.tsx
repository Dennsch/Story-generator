import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      lineHeight: '1.6'
    }}>
      <Head>
        <title>Story Generator API</title>
        <meta name="description" content="Generate storybooks with AI and save to Google Drive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>
          📚 Story Generator API
        </h1>
        
        <p style={{ fontSize: '1.2em', textAlign: 'center', color: '#7f8c8d' }}>
          Generate beautiful storybooks using AI and automatically save them to Google Drive
        </p>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px', 
          margin: '2rem 0',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#2c3e50' }}>🚀 API Endpoint</h2>
          <p><strong>POST</strong> <code>/api/generate-storybook</code></p>
          
          <h3>Request Body:</h3>
          <pre style={{ 
            background: '#2c3e50', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`{
  "description": "A story about a brave little mouse",
  "title": "The Adventures of Squeaky", // optional
  "targetAudience": "children", // optional: children, young-adult, adult
  "length": "medium" // optional: short, medium, long
}`}
          </pre>

          <h3>Response:</h3>
          <pre style={{ 
            background: '#27ae60', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`{
  "success": true,
  "message": "Storybook generated and uploaded successfully",
  "fileId": "1ABC123...",
  "fileName": "the-adventures-of-squeaky-2024-01-15.pdf",
  "driveUrl": "https://drive.google.com/file/d/1ABC123.../view"
}`}
          </pre>
        </div>

        <div style={{ 
          background: '#fff3cd', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #ffeaa7',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#856404' }}>⚙️ Configuration Required</h2>
          <p>Before using this API, make sure to set up the following environment variables:</p>
          <ul>
            <li><strong>GEMINI_API_KEY</strong> - Your Google Gemini API key</li>
            <li><strong>GOOGLE_DRIVE_FOLDER_ID</strong> - Target Google Drive folder ID</li>
            <li><strong>GOOGLE_SERVICE_ACCOUNT_KEY</strong> - Google service account JSON key</li>
          </ul>
          <p>See <code>.env.example</code> for detailed setup instructions.</p>
        </div>

        <div style={{ 
          background: '#d1ecf1', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #bee5eb',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#0c5460' }}>📖 How it works</h2>
          <ol>
            <li><strong>Story Generation:</strong> Uses Google Gemini AI to create engaging storybook content</li>
            <li><strong>PDF Creation:</strong> Converts the story into a beautifully formatted PDF</li>
            <li><strong>Cloud Storage:</strong> Automatically uploads the PDF to your specified Google Drive folder</li>
            <li><strong>Instant Access:</strong> Returns a shareable Google Drive link</li>
          </ol>
        </div>

        <div style={{ 
          background: '#f8d7da', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid #f5c6cb',
          margin: '2rem 0'
        }}>
          <h2 style={{ color: '#721c24' }}>🔧 Example Usage</h2>
          <pre style={{ 
            background: '#2c3e50', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app'}/api/generate-storybook \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "A magical adventure about a young wizard learning to fly",
    "targetAudience": "children",
    "length": "medium"
  }'`}
          </pre>
        </div>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #e9ecef',
          color: '#6c757d'
        }}>
          <p>Built with ❤️ using TypeScript, Next.js, Google Gemini AI, and Google Drive API</p>
        </footer>
      </main>
    </div>
  );
}
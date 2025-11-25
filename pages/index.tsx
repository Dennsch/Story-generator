import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState<'children' | 'young-adult' | 'adult'>('children');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('https://your-app.vercel.app');

  useEffect(() => {
    setApiUrl(window.location.origin);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate-storybook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          title: title || undefined,
          targetAudience,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setDescription('');
        setTitle('');
      } else {
        setError(data.message || 'Failed to generate storybook');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      lineHeight: '1.6'
    }}>
      <Head>
        <title>Story Generator</title>
        <meta name="description" content="Generate storybooks with AI and save to Google Drive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>
          📚 Story Generator
        </h1>
        
        <p style={{ fontSize: '1.2em', textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>
          Generate beautiful 25-page storybooks using AI and automatically save them to Google Drive
        </p>

        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                Story Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the story you want to create... (e.g., A brave little mouse goes on an adventure)"
                required
                maxLength={1000}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <small style={{ color: '#7f8c8d' }}>{description.length}/1000 characters</small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                Story Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave blank to auto-generate"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  background: 'white'
                }}
              >
                <option value="children">Children (5-10)</option>
                <option value="young-adult">Young Adult (11-17)</option>
                <option value="adult">Adult</option>
              </select>
            </div>

            <div style={{ 
              background: '#e3f2fd', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              border: '1px solid #90caf9'
            }}>
              <p style={{ margin: 0, color: '#1565c0', fontSize: '0.95rem' }}>
                📖 All stories are generated with exactly <strong>25 pages</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !description.trim()}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'white',
                background: loading || !description.trim() ? '#95a5a6' : '#3498db',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => {
                if (!loading && description.trim()) {
                  e.currentTarget.style.background = '#2980b9';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && description.trim()) {
                  e.currentTarget.style.background = '#3498db';
                }
              }}
            >
              {loading ? '🎨 Generating Story...' : '✨ Generate Storybook'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '2px solid #fcc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#c33'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{
            background: '#e8f5e9',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Success!</h2>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>File:</strong> {result.fileName}
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>File ID:</strong> {result.fileId}
            </p>
            {result.driveUrl && (
              <a
                href={result.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: '#4caf50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                📄 View in Google Drive
              </a>
            )}
          </div>
        )}

        <details style={{ marginTop: '3rem' }}>
          <summary style={{ 
            cursor: 'pointer', 
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            🚀 API Documentation
          </summary>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '2rem', 
            borderRadius: '8px', 
            marginTop: '1rem',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#2c3e50' }}>Endpoint</h3>
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
  "targetAudience": "children" // optional: children, young-adult, adult
}

Note: All stories are generated with exactly 25 pages.`}
            </pre>

            <h3>Example cURL:</h3>
            <pre style={{ 
              background: '#2c3e50', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto'
            }}>
{`curl -X POST ${apiUrl}/api/generate-storybook \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "A magical adventure",
    "targetAudience": "children"
  }'`}
            </pre>
          </div>
        </details>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #e9ecef',
          color: '#6c757d'
        }}>
          <p>Built with TypeScript, Next.js, Google Gemini AI, and Google Drive API</p>
        </footer>
      </main>
    </div>
  );
}
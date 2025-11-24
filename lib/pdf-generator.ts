import puppeteer from 'puppeteer';
import { GeneratedStory, PDFGenerationOptions } from '@/types';

export class PDFGenerator {
  async generatePDF(
    story: GeneratedStory,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      const html = this.generateHTML(story);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        margin: options.margin || {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in'
        },
        printBackground: true
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  private generateHTML(story: GeneratedStory): string {
    const pagesHTML = story.pages.map(page => `
      <div class="page">
        <div class="page-number">Page ${page.pageNumber}</div>
        <div class="page-content">
          <p>${page.text}</p>
          ${page.imagePrompt ? `<div class="image-placeholder">
            <em>Illustration: ${page.imagePrompt}</em>
          </div>` : ''}
        </div>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${story.title}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .title-page {
            text-align: center;
            padding: 2in 0;
            page-break-after: always;
          }
          
          .title {
            font-size: 2.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 0.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          
          .subtitle {
            font-size: 1.2em;
            color: #7f8c8d;
            font-style: italic;
          }
          
          .page {
            min-height: 8in;
            padding: 1in;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .page:last-child {
            page-break-after: auto;
          }
          
          .page-number {
            position: absolute;
            bottom: 0.5in;
            right: 1in;
            font-size: 0.9em;
            color: #7f8c8d;
          }
          
          .page-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .page-content p {
            font-size: 1.3em;
            line-height: 1.8;
            text-align: justify;
            margin: 0 0 1em 0;
            text-indent: 1.5em;
          }
          
          .image-placeholder {
            border: 2px dashed #bdc3c7;
            padding: 2em;
            margin: 1em 0;
            text-align: center;
            background: #f8f9fa;
            border-radius: 8px;
            min-height: 3in;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .image-placeholder em {
            color: #7f8c8d;
            font-size: 1.1em;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="title-page">
          <h1 class="title">${story.title}</h1>
          <p class="subtitle">A Generated Storybook</p>
        </div>
        
        ${pagesHTML}
      </body>
      </html>
    `;
  }

  generateFileName(story: GeneratedStory): string {
    const sanitizedTitle = story.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitizedTitle}-${timestamp}.pdf`;
  }
}
import PDFDocument from 'pdfkit';
import { GeneratedStory, PDFGenerationOptions } from '@/types';

export class PDFGenerator {
  async generatePDF(
    story: GeneratedStory,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: options.format || 'A4',
          margins: {
            top: 72,
            bottom: 72,
            left: 72,
            right: 72
          }
        });

        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Title page
        doc.fontSize(32)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text(story.title, {
             align: 'center',
             valign: 'center'
           });
        
        doc.moveDown(2);
        doc.fontSize(16)
           .font('Helvetica-Oblique')
           .fillColor('#7f8c8d')
           .text('A Generated Storybook', {
             align: 'center'
           });

        // Story pages
        story.pages.forEach((page, index) => {
          doc.addPage();
          
          // Page content
          doc.fontSize(14)
             .font('Helvetica')
             .fillColor('#333333')
             .text(page.text, {
               align: 'justify',
               lineGap: 8
             });

          // Image prompt placeholder
          if (page.imagePrompt) {
            doc.moveDown(2);
            doc.fontSize(11)
               .font('Helvetica-Oblique')
               .fillColor('#7f8c8d')
               .text(`[Illustration: ${page.imagePrompt}]`, {
                 align: 'center'
               });
          }

          // Page number
          doc.fontSize(10)
             .fillColor('#7f8c8d')
             .text(
               `Page ${page.pageNumber}`,
               doc.page.margins.left,
               doc.page.height - doc.page.margins.bottom + 20,
               {
                 align: 'right',
                 width: doc.page.width - doc.page.margins.left - doc.page.margins.right
               }
             );
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
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
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiConfig, StoryRequest, GeneratedStory, StoryPage } from '@/types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateStorybook(request: StoryRequest): Promise<GeneratedStory> {
    try {
      const prompt = this.buildPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseStoryResponse(text, request.title);
    } catch (error) {
      console.error('Error generating story with Gemini:', error);
      throw new Error('Failed to generate story content');
    }
  }

  private buildPrompt(request: StoryRequest): string {
    const { description, targetAudience = 'children' } = request;

    const audienceGuide = {
      children: 'simple language suitable for ages 5-10, with moral lessons',
      'young-adult': 'engaging language for ages 11-17, with coming-of-age themes',
      adult: 'sophisticated language and complex themes for mature readers'
    };

    return `Create a 25-page storybook based on this description: "${description}"

Target audience: ${targetAudience} (${audienceGuide[targetAudience]})

Please format your response as a JSON object with the following structure:
{
  "title": "Story Title",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page content here...",
      "imagePrompt": "Brief description for illustration"
    }
  ]
}

IMPORTANT: You MUST create exactly 25 pages. The story should be complete and well-paced across all 25 pages.

Guidelines:
- Create EXACTLY 25 pages
- Each page should have 1-3 sentences for children, 2-4 for young adults, 3-5 for adults
- Include vivid descriptions that would work well for illustrations
- Create engaging, age-appropriate content
- Ensure the story has a clear beginning, middle, and end distributed across all 25 pages
- Include an imagePrompt for each page that describes what should be illustrated
- Pace the story appropriately: introduction (pages 1-5), rising action (pages 6-12), climax (pages 13-17), falling action (pages 18-22), resolution (pages 23-25)

Make sure to return valid JSON only, no additional text.`;
  }

  private parseStoryResponse(response: string, title?: string): GeneratedStory {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        title: title || parsed.title || 'Generated Story',
        content: this.generateFullContent(parsed.pages),
        pages: parsed.pages.map((page: any, index: number) => ({
          pageNumber: index + 1,
          text: page.text,
          imagePrompt: page.imagePrompt
        }))
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Fallback: treat the entire response as story content
      return {
        title: title || 'Generated Story',
        content: response,
        pages: this.createFallbackPages(response)
      };
    }
  }

  private generateFullContent(pages: StoryPage[]): string {
    return pages.map(page => page.text).join('\n\n');
  }

  private createFallbackPages(content: string): StoryPage[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const pages: StoryPage[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const pageText = sentences.slice(i, i + 2).join('. ').trim() + '.';
      pages.push({
        pageNumber: pages.length + 1,
        text: pageText,
        imagePrompt: `Illustration for: ${pageText.substring(0, 50)}...`
      });
    }

    return pages.length > 0 ? pages : [{
      pageNumber: 1,
      text: content,
      imagePrompt: 'Story illustration'
    }];
  }
}
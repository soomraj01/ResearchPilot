import Groq from 'groq-sdk';
import { env } from '../../config/env';

export class PlannerService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: env.GROQ_API_KEY || 'dummy_key',
    });
  }

  async generateResearchPlan(topic: string): Promise<string[]> {
    const prompt = `Create a step-by-step research plan for the following topic: ${topic}. Return only the steps as a numbered list.`;
    
    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });
      const content = response.choices[0]?.message?.content || '';
      // Simple parsing of numbered list
      return content.split('\n').filter(line => line.match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, '').trim());
    } catch (error) {
      console.error('Error generating research plan:', error);
      throw error;
    }
  }
}

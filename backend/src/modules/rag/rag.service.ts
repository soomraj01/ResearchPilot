import Groq from 'groq-sdk';
import { env } from '../../config/env';

export class RAGService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: env.GROQ_API_KEY || 'dummy_key',
    });
  }

  async generateAnswer(query: string, context: string[]): Promise<string> {
    const prompt = `Use the following context to answer the user's question. If the context does not contain the answer, say "I don't have enough information."
IMPORTANT INSTRUCTION: Whenever you state a fact or use information from the context, you MUST append a citation at the end of the sentence or paragraph in Markdown format: [Title](URL). Do not use an ID.

Context:
${context.join('\n\n')}

Question: ${query}`;
    
    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating answer with Groq:', error);
      throw error;
    }
  }

  async generateChatResponse(messages: any[], systemPrompt: string): Promise<string> {
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    try {
      const response = await this.groq.chat.completions.create({
        messages: groqMessages as any,
        model: 'llama-3.1-8b-instant',
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating chat response with Groq:', error);
      throw error;
    }
  }
}

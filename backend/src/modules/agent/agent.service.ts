import { PlannerService } from './planner.service';
import { RAGService } from '../rag/rag.service';
import { EmbeddingService } from '../rag/embedding.service';
import { RetrievalService } from '../rag/retrieval.service';
import { MessageService } from '../message/message.service';

export class AgentService {
  private planner: PlannerService;
  private rag: RAGService;
  private embedding: EmbeddingService;
  private retrieval: RetrievalService;
  private messageService: MessageService;

  constructor() {
    this.planner = new PlannerService();
    this.rag = new RAGService();
    this.embedding = new EmbeddingService();
    this.retrieval = new RetrievalService();
    this.messageService = new MessageService();
  }

  async executeResearchTask(topic: string, context: string[]): Promise<any> {
    const plan = await this.planner.generateResearchPlan(topic);
    
    const insights = [];
    for (const step of plan) {
      const answer = await this.rag.generateAnswer(step, context);
      insights.push({ step, answer });
    }

    return { plan, insights };
  }

  async processChatMessage(workspaceId: string, conversationId: string, userMessage: string): Promise<{answer: string, sources: {title: string, url: string}[]}> {
    // 1. Get Conversation History
    const history = await this.messageService.getMessagesByConversation(conversationId);
    
    // We will keep history as actual message objects
    const historyMessages = history.slice(-5).map(m => ({
      role: m.role,
      content: m.content
    }));

    // 2. Retrieve semantic context from Qdrant
    let contextFromPapers: string[] = [];
    let sources: {title: string, url: string}[] = [];
    try {
      const vector = await this.embedding.generateEmbedding(userMessage);
      // We assume collectionName is 'workspace_' + workspaceId
      const collectionName = `workspace_${workspaceId}`;
      const searchResults = await this.retrieval.searchSimilar(collectionName, vector, 10);
      contextFromPapers = searchResults.map(r => `[Source: ${r.payload?.title} (URL: ${r.payload?.url})]\n${r.payload?.text as string || ''}`);
      
      // Extract unique sources
      const uniqueSources = new Map<string, {title: string, url: string}>();
      searchResults.forEach(r => {
        if (r.payload?.title) {
          const title = r.payload.title as string;
          // Use url if available, otherwise just use a placeholder or the title
          const url = (r.payload.url as string) || '#'; 
          if (!uniqueSources.has(title)) { // Use title as key if url might be '#'
            uniqueSources.set(title, { title, url });
          }
        }
      });
      sources = Array.from(uniqueSources.values());
    } catch (error) {
      console.log('Qdrant search skipped or failed (no papers loaded yet?):', error);
    }

    // 3. Generate response via RAG Service
    const systemPrompt = `You are ResearchPilot, an advanced "Deep Research" AI agent. Your capabilities go far beyond a standard chatbot. You are designed to perform comprehensive, in-depth research, synthesis, and analysis.

Your core directives:
1. DEEP SYNTHESIS: Always synthesize information from multiple research papers provided in your context. Do not just summarize one paper; draw connections, contrast findings, and provide a holistic overview.
2. EXTENSIVE DETAIL: Even for short or simple prompts, provide highly detailed, comprehensive, and exhaustive answers. Break down complex topics into digestible sections.
3. VISUALIZATION & ROADMAPS: Whenever explaining a process, architecture, roadmap, or learning path, you MUST generate Mermaid flow diagrams (\`\`\`mermaid ... \`\`\`) to visualize the concepts.
4. ACTIONABLE ROADMAPS: If a user asks how to learn something or what to cover, provide an in-depth, step-by-step roadmap covering all necessary details, prerequisites, and advanced topics.
5. CITATIONS: Whenever you state a fact or use information from the context, you MUST append a citation at the end of the sentence or paragraph in Markdown format: [Title](URL).
6. AUTONOMY: Act as an autonomous agent that has already retrieved the necessary papers, analyzed the conversation history, and is now delivering the final, polished, expert-level briefing directly in the chat.
7. STRICT DOMAIN FOCUS (CRITICAL): You must strictly decline to answer any questions that are irrelevant to the provided workspace context or academic research. If the user asks about general knowledge, casual conversation, coding, or off-topic subjects, politely inform them that you are restricted to discussing the workspace literature and research topics in 1-2 brief sentences. IMPORTANT: When declining a query, you MUST NOT generate any graphs, Mermaid diagrams, roadmaps, detailed analysis, or references. Provide only the brief refusal message.

Context (Relevant snippets from the user's workspace papers):
${contextFromPapers.join('\n\n')}`;

    const messages = [
      ...historyMessages,
      { role: 'user', content: userMessage }
    ];

    const answer = await this.rag.generateChatResponse(messages, systemPrompt);
    
    return { answer, sources };
  }

  async extractInsights(workspaceId: string, conversationId: string): Promise<string> {
    const history = await this.messageService.getMessagesByConversation(conversationId);
    if (history.length < 2) return "Not enough chat history to extract insights.";

    const historyContext = history.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    
    const prompt = `Act as an advanced "Deep Research" AI. Analyze the following conversation history and extract 3-5 profound, highly specific, and novel research insights. 
You must format your response entirely in Markdown. Use headers, bullet points, and bold text for emphasis. Do not output plain unformatted paragraphs.

Conversation History:
${historyContext}`;
    
    const insightText = await this.rag.generateAnswer(prompt, []);
    return insightText;
  }

  async generateArtifact(workspaceId: string, topic: string): Promise<string> {
    let contextFromPapers: string[] = [];
    try {
      const vector = await this.embedding.generateEmbedding(topic);
      const collectionName = `workspace_${workspaceId}`;
      const searchResults = await this.retrieval.searchSimilar(collectionName, vector, 10);
      contextFromPapers = searchResults.map(r => `[Source: ${r.payload?.title} (URL: ${r.payload?.url})]\n${r.payload?.text as string || ''}`);
    } catch (error) {
      console.log('Qdrant search skipped for artifact:', error);
    }

    const prompt = `Act as an advanced "Deep Research" AI. You must ONLY write about the requested topic: "${topic}". Do not hallucinate outside this topic. 
Using the provided context, write an incredibly detailed, comprehensive, and exhaustive markdown report. 
Include an Introduction, Detailed Analysis (broken into subsections), and a Conclusion. Use Mermaid flow diagrams (\`\`\`mermaid ... \`\`\`) to visualize complex concepts if applicable. Format it using professional markdown.`;
    const artifactText = await this.rag.generateAnswer(prompt, contextFromPapers);
    return artifactText;
  }

  async autoDetectWorkspaceInsights(context: string[]): Promise<any[]> {
    if (!context || context.length === 0) {
      return [];
    }
    
    const prompt = `Act as an advanced "Deep Research" AI. Analyze the following research abstracts and identify exactly 3 key insights:
1. One emerging trend (type: "trend")
2. One contradiction or conflicting finding among the papers (type: "contradiction")
3. One research gap that needs further investigation (type: "gap")

You must respond ONLY with a strict JSON array containing exactly 3 objects. Do not include markdown formatting like \`\`\`json. The structure for each object must be:
{ "type": "trend" | "contradiction" | "gap", "title": "Short descriptive title", "content": "Detailed 2-3 sentence explanation" }`;

    const jsonText = await this.rag.generateAnswer(prompt, context);
    
    try {
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse AI JSON response for insights:", e, jsonText);
      return [];
    }
  }
}

import { Paper, IPaper } from './paper.model';
import { ApiError } from '../../utils/ApiError';
import { EmbeddingService } from '../rag/embedding.service';
import { RetrievalService } from '../rag/retrieval.service';
import crypto from 'crypto';

export class PaperService {
  private embeddingService = new EmbeddingService();
  private retrievalService = new RetrievalService();

  async addPaperToWorkspace(workspaceId: string, paperData: Partial<IPaper>): Promise<IPaper> {
    const paper = await Paper.create({ ...paperData, workspaceId });
    
    // Ingest into Qdrant for RAG Context
    try {
      const collectionName = `workspace_${workspaceId}`;
      await this.retrievalService.createCollectionIfNotExists(collectionName, 384); // 384 is dimension for all-MiniLM-L6-v2

      const textToEmbed = `Title: ${paper.title}\nAuthors: ${paper.authors?.join(', ')}\nAbstract: ${paper.abstract || 'No abstract provided.'}`;
      const vector = await this.embeddingService.generateEmbedding(textToEmbed);
      
      // Store in Qdrant with a generated UUID for the point, but keep paperId in payload
      await this.retrievalService.storeVector(
        collectionName, 
        crypto.randomUUID(), 
        vector, 
        { 
          paperId: paper._id.toString(),
          title: paper.title,
          text: textToEmbed,
          url: paper.paperUrl || ''
        }
      );
    } catch (error) {
      console.error('Error ingesting paper into Qdrant:', error);
      // We don't fail the paper creation if Qdrant is down, but we log it.
    }

    return paper;
  }

  async getPapersByWorkspace(workspaceId: string): Promise<IPaper[]> {
    return Paper.find({ workspaceId }).sort({ publishedDate: -1 });
  }

  async getPaperById(workspaceId: string, paperId: string): Promise<IPaper> {
    const paper = await Paper.findOne({ _id: paperId, workspaceId });
    if (!paper) throw new ApiError(404, 'Paper not found in this workspace');
    return paper;
  }

  async removePaper(workspaceId: string, paperId: string): Promise<void> {
    const result = await Paper.deleteOne({ _id: paperId, workspaceId });
    if (result.deletedCount === 0) throw new ApiError(404, 'Paper not found');
  }
}

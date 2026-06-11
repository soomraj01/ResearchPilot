import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../../config/env';

export class RetrievalService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({
      url: env.QDRANT_URL || 'http://localhost:6333',
      apiKey: env.QDRANT_API_KEY,
    });
  }

  async storeVector(collectionName: string, id: string, vector: number[], payload: any) {
    await this.client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id,
          vector,
          payload,
        },
      ],
    });
  }

  async searchSimilar(collectionName: string, queryVector: number[], limit: number = 5) {
    return this.client.search(collectionName, {
      vector: queryVector,
      limit,
    });
  }
  
  async createCollectionIfNotExists(collectionName: string, size: number) {
    try {
      await this.client.getCollection(collectionName);
    } catch {
      await this.client.createCollection(collectionName, {
        vectors: { size, distance: 'Cosine' },
      });
    }
  }
}

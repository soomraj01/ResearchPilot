import { Insight, IInsight } from './insight.model';
import { ApiError } from '../../utils/ApiError';

export class InsightService {
  async getInsightsByWorkspace(workspaceId: string): Promise<IInsight[]> {
    return Insight.find({ workspaceId }).sort({ createdAt: -1 });
  }

  async getInsightById(insightId: string): Promise<IInsight | null> {
    return Insight.findById(insightId);
  }

  async createInsight(data: Partial<IInsight>): Promise<IInsight> {
    const insight = new Insight(data);
    return insight.save();
  }

  async deleteInsight(insightId: string): Promise<IInsight | null> {
    return Insight.findByIdAndDelete(insightId);
  }
}

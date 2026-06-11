import { Conversation, IConversation } from './conversation.model';
import { ApiError } from '../../utils/ApiError';

export class ConversationService {
  async createConversation(workspaceId: string, title: string): Promise<IConversation> {
    const conversation = await Conversation.create({ workspaceId, title });
    return conversation;
  }

  async getConversationsByWorkspace(workspaceId: string): Promise<IConversation[]> {
    return Conversation.find({ workspaceId }).sort({ updatedAt: -1 });
  }

  async getConversationById(workspaceId: string, conversationId: string): Promise<IConversation> {
    const conversation = await Conversation.findOne({ _id: conversationId, workspaceId });
    if (!conversation) throw new ApiError(404, 'Conversation not found');
    return conversation;
  }

  async deleteConversation(workspaceId: string, conversationId: string): Promise<void> {
    const result = await Conversation.deleteOne({ _id: conversationId, workspaceId });
    if (result.deletedCount === 0) throw new ApiError(404, 'Conversation not found');
  }
}

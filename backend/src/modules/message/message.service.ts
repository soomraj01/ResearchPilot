import { Message, IMessage } from './message.model';
import { ApiError } from '../../utils/ApiError';

export class MessageService {
  async getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return Message.find({ conversationId }).sort({ createdAt: 1 });
  }

  async addMessage(conversationId: string, role: string, content: string, sources?: {title: string, url: string}[]): Promise<IMessage> {
    const message = new Message({ conversationId, role, content, sources });
    return message.save();
  }
}

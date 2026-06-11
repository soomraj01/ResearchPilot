import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';
import { AgentService } from '../agent/agent.service';
import { ApiResponse } from '../../utils/ApiResponse';

const messageService = new MessageService();
const agentService = new AgentService();

export class MessageController {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const messages = await messageService.getMessagesByConversation(conversationId);
      res.status(200).json(new ApiResponse(200, messages, 'Messages retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId, workspaceId } = req.params;
      const { role, content } = req.body;
      
      // Save user message
      const userMessage = await messageService.addMessage(conversationId, role, content);
      
      // If role is user, we want the agent to reply
      if (role === 'user') {
        const { answer, sources } = await agentService.processChatMessage(workspaceId, conversationId, content);
        const aiMessage = await messageService.addMessage(conversationId, 'assistant', answer, sources);
        res.status(201).json(new ApiResponse(201, { userMessage, aiMessage }, 'Messages added successfully'));
        return;
      }

      res.status(201).json(new ApiResponse(201, { userMessage }, 'Message added successfully'));
    } catch (error) {
      next(error);
    }
  }
}

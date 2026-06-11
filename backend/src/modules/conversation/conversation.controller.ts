import { Request, Response, NextFunction } from 'express';
import { ConversationService } from './conversation.service';
import { ApiResponse } from '../../utils/ApiResponse';

const conversationService = new ConversationService();

export class ConversationController {
  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const { title } = req.body;
      const result = await conversationService.createConversation(workspaceId, title || 'New Conversation');
      res.status(201).json(new ApiResponse(201, result, 'Conversation created'));
    } catch (error) {
      next(error);
    }
  }

  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const result = await conversationService.getConversationsByWorkspace(workspaceId);
      res.status(200).json(new ApiResponse(200, result, 'Conversations fetched'));
    } catch (error) {
      next(error);
    }
  }

  async getConversationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, conversationId } = req.params;
      const result = await conversationService.getConversationById(workspaceId, conversationId);
      res.status(200).json(new ApiResponse(200, result, 'Conversation fetched'));
    } catch (error) {
      next(error);
    }
  }

  async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, conversationId } = req.params;
      await conversationService.deleteConversation(workspaceId, conversationId);
      res.status(200).json(new ApiResponse(200, null, 'Conversation deleted'));
    } catch (error) {
      next(error);
    }
  }
}

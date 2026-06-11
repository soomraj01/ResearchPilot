import { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from './workspace.service';
import { ApiResponse } from '../../utils/ApiResponse';

const workspaceService = new WorkspaceService();

export class WorkspaceController {
  async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; 
      const { title, description } = req.body;
      const result = await workspaceService.createWorkspace(userId, title, description);
      res.status(201).json(new ApiResponse(201, result, 'Workspace created'));
    } catch (error) {
      next(error);
    }
  }

  async getWorkspaces(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const workspaces = await workspaceService.getWorkspacesByUser(userId);
      
      const Paper = require('../paper/paper.model').Paper;
      const Insight = require('../insight/insight.model').Insight;
      
      const result = await Promise.all(workspaces.map(async (ws: any) => {
        const paperCount = await Paper.countDocuments({ workspaceId: ws._id });
        const insightCount = await Insight.countDocuments({ workspaceId: ws._id });
        return {
          ...ws.toObject(),
          paperCount,
          insightCount
        };
      }));

      res.status(200).json(new ApiResponse(200, result, 'Workspaces fetched'));
    } catch (error) {
      next(error);
    }
  }

  async getWorkspaceById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const result = await workspaceService.getWorkspaceById(userId, id);
      res.status(200).json(new ApiResponse(200, result, 'Workspace fetched'));
    } catch (error) {
      next(error);
    }
  }

  async updateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const result = await workspaceService.updateWorkspace(userId, id, req.body);
      res.status(200).json(new ApiResponse(200, result, 'Workspace updated'));
    } catch (error) {
      next(error);
    }
  }

  async deleteWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      await workspaceService.deleteWorkspace(userId, id);
      res.status(200).json(new ApiResponse(200, null, 'Workspace deleted'));
    } catch (error) {
      next(error);
    }
  }
}

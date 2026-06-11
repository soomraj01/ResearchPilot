import { Request, Response, NextFunction } from 'express';
import { PaperService } from './paper.service';
import { ApiResponse } from '../../utils/ApiResponse';

const paperService = new PaperService();

export class PaperController {
  async addPaper(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const paperData = req.body;
      const result = await paperService.addPaperToWorkspace(workspaceId, paperData);
      res.status(201).json(new ApiResponse(201, result, 'Paper added to workspace'));
    } catch (error) {
      next(error);
    }
  }

  async getPapers(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const result = await paperService.getPapersByWorkspace(workspaceId);
      res.status(200).json(new ApiResponse(200, result, 'Papers fetched'));
    } catch (error) {
      next(error);
    }
  }

  async getPaperById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, paperId } = req.params;
      const result = await paperService.getPaperById(workspaceId, paperId);
      res.status(200).json(new ApiResponse(200, result, 'Paper fetched'));
    } catch (error) {
      next(error);
    }
  }

  async removePaper(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, paperId } = req.params;
      await paperService.removePaper(workspaceId, paperId);
      res.status(200).json(new ApiResponse(200, null, 'Paper removed'));
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { SemanticScholarService } from './semanticScholar.service';
import { ApiResponse } from '../../utils/ApiResponse';

const semanticScholarService = new SemanticScholarService();

export class PaperDiscoveryController {
  async searchPapers(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        res.status(400).json(new ApiResponse(400, null, 'Query parameter "q" is required'));
        return;
      }

      const results = await semanticScholarService.searchPapers(q);
      
      res.status(200).json(new ApiResponse(200, results, 'Papers retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { InsightService } from './insight.service';
import { ApiResponse } from '../../utils/ApiResponse';

const insightService = new InsightService();

export class InsightController {
  async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const insights = await insightService.getInsightsByWorkspace(workspaceId);
      res.status(200).json(new ApiResponse(200, insights, 'Insights retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getInsightById(req: Request, res: Response, next: NextFunction) {
    try {
      const { insightId } = req.params;
      const insight = await insightService.getInsightById(insightId);
      if (!insight) {
        return res.status(404).json(new ApiResponse(404, null, 'Insight not found'));
      }
      res.status(200).json(new ApiResponse(200, insight, 'Insight retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const insightData = { ...req.body, workspaceId };
      const insight = await insightService.createInsight(insightData);
      res.status(201).json(new ApiResponse(201, insight, 'Insight created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async generateInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const { conversationId } = req.body;
      if (!conversationId) {
        return res.status(400).json(new ApiResponse(400, null, 'conversationId is required'));
      }
      
      const AgentService = require('../agent/agent.service').AgentService;
      const agentService = new AgentService();
      
      const content = await agentService.extractInsights(workspaceId, conversationId);
      
      const insightData: any = { 
        workspaceId,
        title: 'Auto-Generated Insight',
        content,
        source: ['Agent Conversation']
      };
      
      const insight = await insightService.createInsight(insightData);
      res.status(201).json(new ApiResponse(201, insight, 'Insight generated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async autoDetectInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      
      const PaperService = require('../paper/paper.service').PaperService;
      const paperService = new PaperService();
      const papers = await paperService.getPapersByWorkspace(workspaceId);
      
      if (!papers || papers.length === 0) {
        return res.status(400).json(new ApiResponse(400, null, 'No literature available in workspace to analyze'));
      }

      const context = papers.map((p: any) => `Title: ${p.title}\nAbstract: ${p.abstract}`);

      const AgentService = require('../agent/agent.service').AgentService;
      const agentService = new AgentService();
      
      const detectedInsights = await agentService.autoDetectWorkspaceInsights(context);
      
      const savedInsights = [];
      for (const item of detectedInsights) {
        if (item.type && item.title && item.content) {
          const insightData: any = {
            workspaceId,
            title: item.title,
            content: item.content,
            type: item.type,
            source: ['Auto-Detection']
          };
          const saved = await insightService.createInsight(insightData);
          savedInsights.push(saved);
        }
      }
      
      res.status(201).json(new ApiResponse(201, savedInsights, 'Insights auto-detected successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { insightId } = req.params;
      const insight = await insightService.deleteInsight(insightId);
      if (!insight) {
        return res.status(404).json(new ApiResponse(404, null, 'Insight not found'));
      }
      res.status(200).json(new ApiResponse(200, null, 'Insight deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

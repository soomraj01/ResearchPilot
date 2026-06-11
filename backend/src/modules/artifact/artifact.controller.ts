import { Request, Response, NextFunction } from 'express';
import { ArtifactService } from './artifact.service';
import { ApiResponse } from '../../utils/ApiResponse';

const artifactService = new ArtifactService();

export class ArtifactController {
  async getArtifacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const artifacts = await artifactService.getArtifactsByWorkspace(workspaceId);
      res.status(200).json(new ApiResponse(200, artifacts, 'Artifacts retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getArtifactById(req: Request, res: Response, next: NextFunction) {
    try {
      const { artifactId } = req.params;
      const artifact = await artifactService.getArtifactById(artifactId);
      if (!artifact) {
        return res.status(404).json(new ApiResponse(404, null, 'Artifact not found'));
      }
      res.status(200).json(new ApiResponse(200, artifact, 'Artifact retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async createArtifact(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const artifactData = { ...req.body, workspaceId };
      const artifact = await artifactService.createArtifact(artifactData);
      res.status(201).json(new ApiResponse(201, artifact, 'Artifact created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async generateArtifact(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const { title, topic } = req.body;
      if (!topic) {
        return res.status(400).json(new ApiResponse(400, null, 'topic is required'));
      }
      
      const AgentService = require('../agent/agent.service').AgentService;
      const agentService = new AgentService();
      
      const content = await agentService.generateArtifact(workspaceId, topic);
      
      const artifactData: any = { 
        workspaceId,
        title: title || 'Auto-Generated Artifact',
        content,
        type: 'report'
      };
      
      const artifact = await artifactService.createArtifact(artifactData);
      res.status(201).json(new ApiResponse(201, artifact, 'Artifact generated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteArtifact(req: Request, res: Response, next: NextFunction) {
    try {
      const { artifactId } = req.params;
      const artifact = await artifactService.deleteArtifact(artifactId);
      if (!artifact) {
        return res.status(404).json(new ApiResponse(404, null, 'Artifact not found'));
      }
      res.status(200).json(new ApiResponse(200, null, 'Artifact deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

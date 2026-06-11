import { Workspace, IWorkspace } from './workspace.model';
import { ApiError } from '../../utils/ApiError';

export class WorkspaceService {
  async createWorkspace(userId: string, title: string, description: string): Promise<IWorkspace> {
    const workspace = await Workspace.create({ userId, title, description });
    return workspace;
  }

  async getWorkspacesByUser(userId: string): Promise<IWorkspace[]> {
    return Workspace.find({ userId }).sort({ updatedAt: -1 });
  }

  async getWorkspaceById(userId: string, workspaceId: string): Promise<IWorkspace> {
    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) throw new ApiError(404, 'Workspace not found');
    return workspace;
  }

  async updateWorkspace(userId: string, workspaceId: string, updates: Partial<IWorkspace>): Promise<IWorkspace> {
    const workspace = await Workspace.findOneAndUpdate(
      { _id: workspaceId, userId },
      { $set: updates },
      { new: true }
    );
    if (!workspace) throw new ApiError(404, 'Workspace not found');
    return workspace;
  }

  async deleteWorkspace(userId: string, workspaceId: string): Promise<void> {
    const result = await Workspace.deleteOne({ _id: workspaceId, userId });
    if (result.deletedCount === 0) throw new ApiError(404, 'Workspace not found');
  }
}

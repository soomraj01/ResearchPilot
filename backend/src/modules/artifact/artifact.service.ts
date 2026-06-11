import { Artifact, IArtifact } from './artifact.model';
import { ApiError } from '../../utils/ApiError';

export class ArtifactService {
  async getArtifactsByWorkspace(workspaceId: string): Promise<IArtifact[]> {
    return Artifact.find({ workspaceId }).sort({ createdAt: -1 });
  }

  async getArtifactById(artifactId: string): Promise<IArtifact | null> {
    return Artifact.findById(artifactId);
  }

  async createArtifact(data: Partial<IArtifact>): Promise<IArtifact> {
    const artifact = new Artifact(data);
    return artifact.save();
  }

  async deleteArtifact(artifactId: string): Promise<IArtifact | null> {
    return Artifact.findByIdAndDelete(artifactId);
  }
}

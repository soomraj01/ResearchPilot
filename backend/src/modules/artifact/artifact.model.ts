import mongoose, { Schema, Document } from 'mongoose';

export interface IArtifact extends Document {
  workspaceId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  content: string;
  sourcePaperIds: mongoose.Types.ObjectId[];
  sourceInsightIds: mongoose.Types.ObjectId[];
}

const ArtifactSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sourcePaperIds: [{ type: Schema.Types.ObjectId, ref: 'Paper' }],
  sourceInsightIds: [{ type: Schema.Types.ObjectId, ref: 'Insight' }]
}, { timestamps: true });

export const Artifact = mongoose.model<IArtifact>('Artifact', ArtifactSchema);

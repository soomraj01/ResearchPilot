import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspace extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
}

const WorkspaceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

export const Workspace = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

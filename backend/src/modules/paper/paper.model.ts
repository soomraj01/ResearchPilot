import mongoose, { Schema, Document } from 'mongoose';

export interface IPaper extends Document {
  workspaceId: mongoose.Types.ObjectId;
  title: string;
  authors: string[];
  abstract: string;
  paperUrl: string;
  source: string;
  publishedDate: Date;
}

const PaperSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  title: { type: String, required: true },
  authors: [{ type: String }],
  abstract: { type: String },
  paperUrl: { type: String },
  source: { type: String },
  publishedDate: { type: Date }
}, { timestamps: true });

export const Paper = mongoose.model<IPaper>('Paper', PaperSchema);

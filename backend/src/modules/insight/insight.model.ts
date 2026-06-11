import mongoose, { Schema, Document } from 'mongoose';

export interface IInsight extends Document {
  workspaceId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  sourcePaperIds: mongoose.Types.ObjectId[];
  sourceConversationIds: mongoose.Types.ObjectId[];
}

const InsightSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sourcePaperIds: [{ type: Schema.Types.ObjectId, ref: 'Paper' }],
  sourceConversationIds: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }]
}, { timestamps: true });

export const Insight = mongoose.model<IInsight>('Insight', InsightSchema);

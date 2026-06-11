import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  workspaceId: mongoose.Types.ObjectId;
  title: string;
}

const ConversationSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  title: { type: String, required: true }
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

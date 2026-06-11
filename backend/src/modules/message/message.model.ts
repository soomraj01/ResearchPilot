import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: string;
  content: string;
  sources?: { title: string, url: string }[];
}

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  sources: [{
    title: { type: String },
    url: { type: String }
  }]
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

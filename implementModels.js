const fs = require('fs');
const path = require('path');

const BACKEND_BASE = path.join(__dirname, 'backend', 'src', 'modules');

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

createFile(path.join(BACKEND_BASE, 'paper/paper.model.ts'), `import mongoose, { Schema, Document } from 'mongoose';

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

export const Paper = mongoose.model<IPaper>('Paper', PaperSchema);`);

createFile(path.join(BACKEND_BASE, 'conversation/conversation.model.ts'), `import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  workspaceId: mongoose.Types.ObjectId;
  title: string;
}

const ConversationSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  title: { type: String, required: true }
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);`);

createFile(path.join(BACKEND_BASE, 'message/message.model.ts'), `import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: string;
  content: string;
}

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);`);

createFile(path.join(BACKEND_BASE, 'insight/insight.model.ts'), `import mongoose, { Schema, Document } from 'mongoose';

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

export const Insight = mongoose.model<IInsight>('Insight', InsightSchema);`);

createFile(path.join(BACKEND_BASE, 'artifact/artifact.model.ts'), `import mongoose, { Schema, Document } from 'mongoose';

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

export const Artifact = mongoose.model<IArtifact>('Artifact', ArtifactSchema);`);

console.log('Models generated.');

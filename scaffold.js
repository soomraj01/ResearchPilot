const fs = require('fs');
const path = require('path');

const BACKEND_BASE = path.join(__dirname, 'backend', 'src');
const FRONTEND_BASE = path.join(__dirname, 'frontend', 'src');

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createFile(filePath, content) {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

// BACKEND MODULES
const modules = [
  'auth', 'workspace', 'paper', 'conversation', 'message', 'insight', 'artifact'
];

modules.forEach(mod => {
  const Name = mod.charAt(0).toUpperCase() + mod.slice(1);
  createFile(path.join(BACKEND_BASE, `modules/${mod}/${mod}.controller.ts`), `export class ${Name}Controller {\n  // TODO: implement controller methods\n}`);
  createFile(path.join(BACKEND_BASE, `modules/${mod}/${mod}.service.ts`), `export class ${Name}Service {\n  // TODO: implement service logic\n}`);
  createFile(path.join(BACKEND_BASE, `modules/${mod}/${mod}.routes.ts`), `import { Router } from 'express';\n\nconst router = Router();\n// TODO: define routes\n\nexport const ${mod}Routes = router;`);
  createFile(path.join(BACKEND_BASE, `modules/${mod}/${mod}.model.ts`), `import mongoose, { Schema, Document } from 'mongoose';\n\nexport interface I${Name} extends Document {}\n\nconst ${mod}Schema = new Schema({}, { timestamps: true });\n\nexport const ${Name} = mongoose.model<I${Name}>('${Name}', ${mod}Schema);`);
  if (mod === 'auth' || mod === 'workspace') {
    createFile(path.join(BACKEND_BASE, `modules/${mod}/${mod}.validation.ts`), `export const ${mod}Validation = {};`);
  }
});

// BACKEND AGENT & RAG
createFile(path.join(BACKEND_BASE, 'modules/agent/planner.service.ts'), `export class PlannerService {}`);
createFile(path.join(BACKEND_BASE, 'modules/agent/agent.service.ts'), `export class AgentService {}`);
createFile(path.join(BACKEND_BASE, 'modules/rag/rag.service.ts'), `export class RagService {}`);
createFile(path.join(BACKEND_BASE, 'modules/rag/embedding.service.ts'), `export class EmbeddingService {}`);
createFile(path.join(BACKEND_BASE, 'modules/rag/retrieval.service.ts'), `export class RetrievalService {}`);
createFile(path.join(BACKEND_BASE, 'modules/paper-discovery/semanticScholar.service.ts'), `export class SemanticScholarService {}`);
createFile(path.join(BACKEND_BASE, 'modules/paper-discovery/arxiv.service.ts'), `export class ArxivService {}`);

// BACKEND SHARED
createFile(path.join(BACKEND_BASE, 'config/db.ts'), `import mongoose from 'mongoose';\nexport const connectDB = async () => {\n  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/researchpilot';\n  await mongoose.connect(uri);\n};`);
createFile(path.join(BACKEND_BASE, 'config/env.ts'), `export const env = process.env;`);
createFile(path.join(BACKEND_BASE, 'middleware/auth.middleware.ts'), `import { Request, Response, NextFunction } from 'express';\nexport const authenticate = (req: Request, res: Response, next: NextFunction) => { next(); };`);
createFile(path.join(BACKEND_BASE, 'middleware/error.middleware.ts'), `import { Request, Response, NextFunction } from 'express';\nexport const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => { res.status(500).json({ error: err.message }); };`);
createFile(path.join(BACKEND_BASE, 'utils/ApiError.ts'), `export class ApiError extends Error {\n  constructor(public statusCode: number, message: string) {\n    super(message);\n  }\n}`);
createFile(path.join(BACKEND_BASE, 'utils/ApiResponse.ts'), `export class ApiResponse<T> {\n  constructor(public statusCode: number, public data: T, public message: string = "Success") {}\n}`);

// SERVER TS REPLACEMENT
createFile(path.join(BACKEND_BASE, 'server.ts'), `import app from './app';\nimport { connectDB } from './config/db';\n\nconst PORT = process.env.PORT || 5000;\n\nconnectDB().then(() => {\n  app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n});`);

// FRONTEND COMPONENTS
const commonComponents = ['Button', 'Input', 'Modal', 'Card', 'GlassPanel'];
commonComponents.forEach(c => {
  createFile(path.join(FRONTEND_BASE, `components/common/${c}.tsx`), `export const ${c} = () => <div>${c}</div>;`);
});

const layoutComponents = ['Sidebar', 'Header', 'WorkspaceShell'];
layoutComponents.forEach(c => {
  createFile(path.join(FRONTEND_BASE, `components/layout/${c}.tsx`), `export const ${c} = ({ children }: any) => <div>{children}</div>;`);
});

// FRONTEND FEATURES
const features = {
  auth: ['Login', 'Register'],
  workspace: ['WorkspaceCard', 'WorkspaceModal', 'WorkspaceList'],
  papers: ['PaperCard', 'PaperList'],
  chat: ['ChatWindow', 'MessageBubble'],
  insights: ['InsightCard'],
  artifacts: ['ArtifactCard'],
  agent: ['AgentTimeline', 'ToolExecutionPanel']
};

for (const [feature, components] of Object.entries(features)) {
  components.forEach(c => {
    createFile(path.join(FRONTEND_BASE, `features/${feature}/${c}.tsx`), `export const ${c} = () => <div>${c}</div>;`);
  });
}

// FRONTEND PAGES
const pages = ['LoginPage', 'DashboardPage', 'WorkspacePage', 'PapersPage', 'InsightsPage', 'ArtifactsPage'];
pages.forEach(p => {
  createFile(path.join(FRONTEND_BASE, `pages/${p}.tsx`), `export default function ${p}() { return <div>${p}</div>; }`);
});

// FRONTEND EMPTY DIRS
['hooks', 'api', 'services', 'types', 'routes'].forEach(d => {
  createDir(path.join(FRONTEND_BASE, d));
});

console.log('Enterprise scaffolding complete.');

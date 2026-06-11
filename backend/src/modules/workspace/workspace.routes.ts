import { Router } from 'express';
import { WorkspaceController } from './workspace.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const workspaceController = new WorkspaceController();

// Use authentication middleware for all workspace routes
router.use(authenticate);

router.post('/', workspaceController.createWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:id', workspaceController.getWorkspaceById);
router.put('/:id', workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

import { paperRoutes } from '../paper/paper.routes';
import { conversationRoutes } from '../conversation/conversation.routes';
import { insightRoutes } from '../insight/insight.routes';
import { artifactRoutes } from '../artifact/artifact.routes';

router.use('/:workspaceId/papers', paperRoutes);
router.use('/:workspaceId/conversations', conversationRoutes);
router.use('/:workspaceId/insights', insightRoutes);
router.use('/:workspaceId/artifacts', artifactRoutes);

export const workspaceRoutes = router;

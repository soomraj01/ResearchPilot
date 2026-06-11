import { Router } from 'express';
import { MessageController } from './message.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const messageController = new MessageController();

router.use(authenticate);

// Mounted on /api/workspace/:workspaceId/conversations/:conversationId/messages
router.get('/', messageController.getMessages);
router.post('/', messageController.addMessage);

export const messageRoutes = router;

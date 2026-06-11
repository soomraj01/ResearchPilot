import { Router } from 'express';
import { ConversationController } from './conversation.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const conversationController = new ConversationController();

router.use(authenticate);

// Mounted on /api/workspace/:workspaceId/conversations
router.post('/', conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.get('/:conversationId', conversationController.getConversationById);
router.delete('/:conversationId', conversationController.deleteConversation);

import { messageRoutes } from '../message/message.routes';

router.use('/:conversationId/messages', messageRoutes);

export const conversationRoutes = router;

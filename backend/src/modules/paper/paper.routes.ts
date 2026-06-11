import { Router } from 'express';
import { PaperController } from './paper.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const paperController = new PaperController();

router.use(authenticate);

// These routes assume they are mounted on /api/workspace/:workspaceId/papers
router.post('/', paperController.addPaper);
router.get('/', paperController.getPapers);
router.get('/:paperId', paperController.getPaperById);
router.delete('/:paperId', paperController.removePaper);

export const paperRoutes = router;

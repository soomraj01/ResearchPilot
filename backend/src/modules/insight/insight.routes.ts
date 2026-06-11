import { Router } from 'express';
import { InsightController } from './insight.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const insightController = new InsightController();

router.use(authenticate);

// Mounted on /api/workspace/:workspaceId/insights
router.get('/', insightController.getInsights);
router.post('/', insightController.createInsight);
router.post('/generate', insightController.generateInsight);
router.post('/auto-detect', insightController.autoDetectInsights);
router.get('/:insightId', insightController.getInsightById);
router.delete('/:insightId', insightController.deleteInsight);

export const insightRoutes = router;

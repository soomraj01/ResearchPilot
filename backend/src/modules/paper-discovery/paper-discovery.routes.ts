import { Router } from 'express';
import { PaperDiscoveryController } from './paper-discovery.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const paperDiscoveryController = new PaperDiscoveryController();

// We might want to authenticate search routes to prevent abuse, or leave them open. 
// For now, let's authenticate them.
router.use(authenticate);

router.get('/search', paperDiscoveryController.searchPapers);

export const paperDiscoveryRoutes = router;

import { Router } from 'express';
import { ArtifactController } from './artifact.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router({ mergeParams: true });
const artifactController = new ArtifactController();

router.use(authenticate);

// Mounted on /api/workspace/:workspaceId/artifacts
router.get('/', artifactController.getArtifacts);
router.post('/', artifactController.createArtifact);
router.post('/generate', artifactController.generateArtifact);
router.get('/:artifactId', artifactController.getArtifactById);
router.delete('/:artifactId', artifactController.deleteArtifact);

export const artifactRoutes = router;

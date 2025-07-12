import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';
import * as controller from '../controllers/equipmentType.controller';

const router = Router();

router.post('/', authenticate, authorizeRoles('admin', 'editor'), controller.create);        // Create new equipment type
router.get('/', authenticate, controller.getAll);         // Get all equipment types
router.get('/:id', authenticate, controller.getById);     // Get single equipment type
router.put('/:id', authenticate, authorizeRoles('admin', 'editor'), controller.update);      // Update
router.delete('/:id', authenticate, authorizeRoles('admin'), controller.remove);   // Delete

export default router;

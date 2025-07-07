import { Router } from 'express';
import * as controller from '../controllers/equipmentType.controller';

const router = Router();

router.post('/', controller.create);        // Create new equipment type
router.get('/', controller.getAll);         // Get all equipment types
router.get('/:id', controller.getById);     // Get single equipment type
router.put('/:id', controller.update);      // Update
router.delete('/:id', controller.remove);   // Delete

export default router;

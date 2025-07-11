import { Router } from 'express';
import {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from '../controllers/component.controller';

const router = Router();

router.get('/', getAllComponents);
router.get('/:id', getComponentById);
router.post('/', createComponent);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

export default router;
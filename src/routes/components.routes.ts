import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';
import {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from '../controllers/component.controller';

const router = Router();

router.get('/', authenticate, getAllComponents);
router.get('/:id', authenticate, getComponentById);
router.post('/', authenticate, authorizeRoles('admin', 'editor'), createComponent);
router.put('/:id', authenticate, authorizeRoles('admin', 'editor'), updateComponent);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteComponent);

export default router;
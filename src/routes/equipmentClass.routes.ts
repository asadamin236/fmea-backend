import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';
import {
  getAllEquipmentClasses,
  getEquipmentClassById,
  createEquipmentClass,
  updateEquipmentClass,
  deleteEquipmentClass,
} from '../controllers/equipmentClass.controller';

const router = Router();

router.get('/', authenticate, getAllEquipmentClasses);
router.get('/:id', authenticate, getEquipmentClassById);
router.post('/', authenticate, authorizeRoles('admin', 'editor'), createEquipmentClass);
router.put('/:id', authenticate, authorizeRoles('admin', 'editor'), updateEquipmentClass);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteEquipmentClass);

export default router;

import { Router } from 'express';
import {
  getAllEquipmentClasses,
  getEquipmentClassById,
  createEquipmentClass,
  updateEquipmentClass,
  deleteEquipmentClass,
} from '../controllers/equipmentClass.controller';

const router = Router();

router.get('/', getAllEquipmentClasses);
router.get('/:id', getEquipmentClassById);
router.post('/', createEquipmentClass);
router.put('/:id', updateEquipmentClass);
router.delete('/:id', deleteEquipmentClass);

export default router;

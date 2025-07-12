import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';
import {
  getAllManufacturers,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from '../controllers/manufacturer.controller';

const router = Router();

// Get all manufacturers
router.get('/', authenticate, getAllManufacturers);

// Get single manufacturer by ID
router.get('/:id', authenticate, getManufacturerById);

// Create new manufacturer (admin/editor only)
router.post('/', authenticate, authorizeRoles('admin', 'editor'), createManufacturer);

// Update manufacturer (admin/editor only)
router.put('/:id', authenticate, authorizeRoles('admin', 'editor'), updateManufacturer);

// Delete manufacturer (admin only)
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteManufacturer);

export default router; 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const manufacturer_controller_1 = require("../controllers/manufacturer.controller");
const router = (0, express_1.Router)();
// Get all manufacturers
router.get('/', authenticate_1.authenticate, manufacturer_controller_1.getAllManufacturers);
// Get single manufacturer by ID
router.get('/:id', authenticate_1.authenticate, manufacturer_controller_1.getManufacturerById);
// Create new manufacturer (admin/editor only)
router.post('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin', 'editor'), manufacturer_controller_1.createManufacturer);
// Update manufacturer (admin/editor only)
router.put('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin', 'editor'), manufacturer_controller_1.updateManufacturer);
// Delete manufacturer (admin only)
router.delete('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin'), manufacturer_controller_1.deleteManufacturer);
exports.default = router;

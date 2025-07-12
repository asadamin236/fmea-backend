"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const controller = __importStar(require("../controllers/equipmentType.controller"));
const router = (0, express_1.Router)();
router.post('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin', 'editor'), controller.create); // Create new equipment type
router.get('/', authenticate_1.authenticate, controller.getAll); // Get all equipment types
router.get('/:id', authenticate_1.authenticate, controller.getById); // Get single equipment type
router.put('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin', 'editor'), controller.update); // Update
router.delete('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)('admin'), controller.remove); // Delete
exports.default = router;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const service = __importStar(require("../services/equipmentType.service"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, equipmentClassId, systems = [] } = req.body;
        if (!name || !equipmentClassId) {
            return res
                .status(400)
                .json({ message: "Name and equipmentClassId are required." });
        }
        const created = yield service.create({ name, equipmentClassId, systems });
        return res.status(201).json(created);
    }
    catch (error) {
        console.error("Error creating equipment type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.create = create;
const getAll = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield service.getAll();
        return res.json(list);
    }
    catch (error) {
        console.error("Error fetching equipment types:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAll = getAll;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield service.getById(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Equipment type not found" });
        return res.json(item);
    }
    catch (error) {
        console.error("Error fetching equipment type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getById = getById;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield service.update(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ message: "Equipment type not found" });
        return res.json(updated);
    }
    catch (error) {
        console.error("Error updating equipment type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield service.remove(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Equipment type not found" });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting equipment type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.remove = remove;

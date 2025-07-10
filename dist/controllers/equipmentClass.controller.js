"use strict";
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
exports.deleteEquipmentClass = exports.updateEquipmentClass = exports.createEquipmentClass = exports.getEquipmentClassById = exports.getAllEquipmentClasses = void 0;
const equipmentClass_model_1 = require("../models/equipmentClass.model");
const getAllEquipmentClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield equipmentClass_model_1.EquipmentClass.find();
    res.json(data);
});
exports.getAllEquipmentClasses = getAllEquipmentClasses;
const getEquipmentClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield equipmentClass_model_1.EquipmentClass.findById(req.params.id);
    if (!item)
        return res.status(404).json({ error: 'Not found' });
    res.json(item);
});
exports.getEquipmentClassById = getEquipmentClassById;
const createEquipmentClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newItem = new equipmentClass_model_1.EquipmentClass(req.body);
        yield newItem.save();
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create', details: err });
    }
});
exports.createEquipmentClass = createEquipmentClass;
const updateEquipmentClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield equipmentClass_model_1.EquipmentClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Update failed', details: err });
    }
});
exports.updateEquipmentClass = updateEquipmentClass;
const deleteEquipmentClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield equipmentClass_model_1.EquipmentClass.findByIdAndDelete(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
});
exports.deleteEquipmentClass = deleteEquipmentClass;

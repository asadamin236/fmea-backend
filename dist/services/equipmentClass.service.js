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
exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createClass = void 0;
const equipmentClass_model_1 = require("../models/equipmentClass.model");
const createClass = (data) => __awaiter(void 0, void 0, void 0, function* () { return equipmentClass_model_1.EquipmentClass.create(data); });
exports.createClass = createClass;
const getAllClasses = () => __awaiter(void 0, void 0, void 0, function* () { return equipmentClass_model_1.EquipmentClass.find(); });
exports.getAllClasses = getAllClasses;
const getClassById = (id) => __awaiter(void 0, void 0, void 0, function* () { return equipmentClass_model_1.EquipmentClass.findById(id); });
exports.getClassById = getClassById;
const updateClass = (id, data) => __awaiter(void 0, void 0, void 0, function* () { return equipmentClass_model_1.EquipmentClass.findByIdAndUpdate(id, data, { new: true }); });
exports.updateClass = updateClass;
const deleteClass = (id) => __awaiter(void 0, void 0, void 0, function* () { return equipmentClass_model_1.EquipmentClass.findByIdAndDelete(id); });
exports.deleteClass = deleteClass;

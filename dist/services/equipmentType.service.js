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
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const equipmentType_model_1 = require("../models/equipmentType.model");
const create = (data) => __awaiter(void 0, void 0, void 0, function* () { return equipmentType_model_1.EquipmentType.create(data); });
exports.create = create;
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return equipmentType_model_1.EquipmentType.find()
        .populate('equipmentClassId')
        .populate('systems'); // 👈 this needs System model registered
});
exports.getAll = getAll;
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () { return equipmentType_model_1.EquipmentType.findById(id).populate('equipmentClassId systems'); });
exports.getById = getById;
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () { return equipmentType_model_1.EquipmentType.findByIdAndUpdate(id, data, { new: true }); });
exports.update = update;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () { return equipmentType_model_1.EquipmentType.findByIdAndDelete(id); });
exports.remove = remove;

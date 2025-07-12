"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentType = void 0;
const mongoose_1 = require("mongoose");
const equipmentTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Equipment type name is required'],
        trim: true,
    },
    equipmentClassId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'EquipmentClass',
        required: [true, 'Equipment class is required']
    },
    systems: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'System',
            default: []
        }
    ]
}, { timestamps: true });
exports.EquipmentType = (0, mongoose_1.model)('EquipmentType', equipmentTypeSchema);

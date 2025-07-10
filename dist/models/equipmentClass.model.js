"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentClass = void 0;
const mongoose_1 = require("mongoose");
const equipmentClassSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    engineeringDiscipline: {
        type: String,
        enum: ['Mechanical', 'Electrical', 'Instrumentation', 'Civil', 'Process'],
    },
    lastReviewed: { type: Date },
    reviewerList: [{ type: String }],
}, { timestamps: true });
exports.EquipmentClass = (0, mongoose_1.model)('EquipmentClass', equipmentClassSchema);

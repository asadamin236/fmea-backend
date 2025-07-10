"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const mongoose_1 = require("mongoose");
const systemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
}, { timestamps: true });
exports.System = (0, mongoose_1.model)("System", systemSchema);

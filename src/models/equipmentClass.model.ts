import { Schema, model } from 'mongoose';

const equipmentClassSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  engineeringDiscipline: {
    type: String,
    enum: ['Mechanical', 'Electrical', 'Instrumentation', 'Civil', 'Process'],
  },
  lastReviewed: { type: Date },
  reviewerList: [{ type: String }],
}, { timestamps: true });

export const EquipmentClass = model('EquipmentClass', equipmentClassSchema);

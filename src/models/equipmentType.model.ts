import { Schema, model, Types, Document } from 'mongoose';

interface IEquipmentType extends Document {
  name: string;
  equipmentClassId: Types.ObjectId;
  systems: Types.ObjectId[];
}

const equipmentTypeSchema = new Schema<IEquipmentType>({
  name: {
    type: String,
    required: [true, 'Equipment type name is required'],
    trim: true,
  },
  equipmentClassId: {
    type: Types.ObjectId,
    ref: 'EquipmentClass',
    required: [true, 'Equipment class is required']
  },
  systems: [
    {
      type: Types.ObjectId,
      ref: 'System',
      default: []
    }
  ]
}, { timestamps: true });

export const EquipmentType = model<IEquipmentType>('EquipmentType', equipmentTypeSchema);

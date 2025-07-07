import { EquipmentType } from '../models/equipmentType.model';
import { System } from '../models/system.model';

export const create = async (data: {
  name: string;
  equipmentClassId: string;
  systems?: string[];
}) => EquipmentType.create(data);

export const getAll = async () => {
  return EquipmentType.find()
    .populate('equipmentClassId')
    .populate('systems'); // 👈 this needs System model registered
};

export const getById = async (id: string) =>
  EquipmentType.findById(id).populate('equipmentClassId systems');

export const update = async (id: string, data: Partial<{
  name: string;
  equipmentClassId: string;
  systems: string[];
}>) => EquipmentType.findByIdAndUpdate(id, data, { new: true });

export const remove = async (id: string) => EquipmentType.findByIdAndDelete(id);

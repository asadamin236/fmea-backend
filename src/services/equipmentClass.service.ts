import { EquipmentClass } from '../models/equipmentClass.model';

export const createClass = async (data: {
  name: string;
  description: string;
  engineeringDiscipline: string;
}) => EquipmentClass.create(data);

export const getAllClasses = async () => EquipmentClass.find();

export const getClassById = async (id: string) => EquipmentClass.findById(id);

export const updateClass = async (id: string, data: Partial<{
  name: string;
  description: string;
  engineeringDiscipline: string;
}>) => EquipmentClass.findByIdAndUpdate(id, data, { new: true });

export const deleteClass = async (id: string) => EquipmentClass.findByIdAndDelete(id);

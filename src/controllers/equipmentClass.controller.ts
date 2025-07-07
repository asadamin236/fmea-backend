import { Request, Response } from 'express';
import { EquipmentClass } from '../models/equipmentClass.model';

export const getAllEquipmentClasses = async (req: Request, res: Response) => {
  const data = await EquipmentClass.find();
  res.json(data);
};

export const getEquipmentClassById = async (req: Request, res: Response) => {
  const item = await EquipmentClass.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

export const createEquipmentClass = async (req: Request, res: Response) => {
  try {
    const newItem = new EquipmentClass(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create', details: err });
  }
};

export const updateEquipmentClass = async (req: Request, res: Response) => {
  try {
    const updated = await EquipmentClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err });
  }
};

export const deleteEquipmentClass = async (req: Request, res: Response) => {
  const deleted = await EquipmentClass.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
};

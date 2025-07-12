import { Request, Response } from "express";
import * as service from "../services/equipmentType.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, equipmentClassId, systems = [] } = req.body;

    if (!name || !equipmentClassId) {
      res.status(400).json({ message: "Name and equipmentClassId are required." });
      return;
    }

    const created = await service.create({ name, equipmentClassId, systems });
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating equipment type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (_: Request, res: Response): Promise<void> => {
  try {
    const list = await service.getAll();
    res.json(list);
  } catch (error) {
    console.error("Error fetching equipment types:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Equipment type not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching equipment type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await service.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Equipment type not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating equipment type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Equipment type not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting equipment type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

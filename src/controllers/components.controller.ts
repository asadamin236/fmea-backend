import { Request, Response } from "express";
import { Component } from "../models/components.model";

export const getAllComponents = async (req: Request, res: Response): Promise<void> => {
  const data = await Component.find();
  res.json(data);
};

export const getComponentById = async (req: Request, res: Response): Promise<void> => {
  const item = await Component.findById(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(item);
};

export const createComponent = async (req: Request, res: Response): Promise<void> => {
  try {
    const newItem = new Component(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create", details: err });
  }
};

export const updateComponent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err });
  }
};

export const deleteComponent = async (req: Request, res: Response): Promise<void> => {
  const deleted = await Component.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
};

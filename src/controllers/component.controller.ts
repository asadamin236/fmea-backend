import { Request, Response } from "express";
import { Component } from "../models/component.model";

export const getAllComponents = async (req: Request, res: Response) => {
  const data = await Component.find();
  res.json(data);
};

export const getComponentById = async (req: Request, res: Response) => {
  const item = await Component.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
};

export const createComponent = async (req: Request, res: Response) => {
  try {
    const newItem = new Component(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create", details: err });
  }
};

export const updateComponent = async (req: Request, res: Response) => {
  try {
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err });
  }
};

export const deleteComponent = async (req: Request, res: Response) => {
  const deleted = await Component.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
};

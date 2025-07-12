import { Request, Response } from "express";
import { Manufacturer } from "../models/manufacturer.model";

export const getAllManufacturers = async (req: Request, res: Response): Promise<void> => {
  try {
    const manufacturers = await Manufacturer.find().sort({ createdAt: -1 });
    res.json(manufacturers);
  } catch (err: any) {
    console.error("❌ Error fetching manufacturers:", err);
    res.status(500).json({ error: "Failed to fetch manufacturers" });
  }
};

export const getManufacturerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) {
      res.status(404).json({ error: "Manufacturer not found" });
      return;
    }
    res.json(manufacturer);
  } catch (err: any) {
    console.error("❌ Error fetching manufacturer:", err);
    res.status(500).json({ error: "Failed to fetch manufacturer" });
  }
};

export const createManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactInfo, website } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    // Check if manufacturer with same name already exists
    const existingManufacturer = await Manufacturer.findOne({ name });
    if (existingManufacturer) {
      res.status(409).json({ error: "Manufacturer with this name already exists" });
      return;
    }

    const newManufacturer = new Manufacturer({
      name,
      contactInfo,
      website
    });

    await newManufacturer.save();
    res.status(201).json(newManufacturer);
  } catch (err: any) {
    console.error("❌ Error creating manufacturer:", err);
    res.status(500).json({ error: "Failed to create manufacturer" });
  }
};

export const updateManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactInfo, website } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    // Check if another manufacturer with same name exists (excluding current one)
    const existingManufacturer = await Manufacturer.findOne({ 
      name, 
      _id: { $ne: req.params.id } 
    });
    if (existingManufacturer) {
      res.status(409).json({ error: "Manufacturer with this name already exists" });
      return;
    }

    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      { name, contactInfo, website },
      { new: true }
    );

    if (!updatedManufacturer) {
      res.status(404).json({ error: "Manufacturer not found" });
      return;
    }

    res.json(updatedManufacturer);
  } catch (err: any) {
    console.error("❌ Error updating manufacturer:", err);
    res.status(500).json({ error: "Failed to update manufacturer" });
  }
};

export const deleteManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedManufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
    
    if (!deletedManufacturer) {
      res.status(404).json({ error: "Manufacturer not found" });
      return;
    }

    res.status(204).send();
  } catch (err: any) {
    console.error("❌ Error deleting manufacturer:", err);
    res.status(500).json({ error: "Failed to delete manufacturer" });
  }
}; 
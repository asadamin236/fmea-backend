"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManufacturer = exports.updateManufacturer = exports.createManufacturer = exports.getManufacturerById = exports.getAllManufacturers = void 0;
const manufacturer_model_1 = require("../models/manufacturer.model");
const getAllManufacturers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturers = yield manufacturer_model_1.Manufacturer.find().sort({ createdAt: -1 });
        res.json(manufacturers);
    }
    catch (err) {
        console.error("❌ Error fetching manufacturers:", err);
        res.status(500).json({ error: "Failed to fetch manufacturers" });
    }
});
exports.getAllManufacturers = getAllManufacturers;
const getManufacturerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturer = yield manufacturer_model_1.Manufacturer.findById(req.params.id);
        if (!manufacturer) {
            res.status(404).json({ error: "Manufacturer not found" });
            return;
        }
        res.json(manufacturer);
    }
    catch (err) {
        console.error("❌ Error fetching manufacturer:", err);
        res.status(500).json({ error: "Failed to fetch manufacturer" });
    }
});
exports.getManufacturerById = getManufacturerById;
const createManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, contactInfo, website } = req.body;
        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }
        // Check if manufacturer with same name already exists
        const existingManufacturer = yield manufacturer_model_1.Manufacturer.findOne({ name });
        if (existingManufacturer) {
            res.status(409).json({ error: "Manufacturer with this name already exists" });
            return;
        }
        const newManufacturer = new manufacturer_model_1.Manufacturer({
            name,
            contactInfo,
            website
        });
        yield newManufacturer.save();
        res.status(201).json(newManufacturer);
    }
    catch (err) {
        console.error("❌ Error creating manufacturer:", err);
        res.status(500).json({ error: "Failed to create manufacturer" });
    }
});
exports.createManufacturer = createManufacturer;
const updateManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, contactInfo, website } = req.body;
        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }
        // Check if another manufacturer with same name exists (excluding current one)
        const existingManufacturer = yield manufacturer_model_1.Manufacturer.findOne({
            name,
            _id: { $ne: req.params.id }
        });
        if (existingManufacturer) {
            res.status(409).json({ error: "Manufacturer with this name already exists" });
            return;
        }
        const updatedManufacturer = yield manufacturer_model_1.Manufacturer.findByIdAndUpdate(req.params.id, { name, contactInfo, website }, { new: true });
        if (!updatedManufacturer) {
            res.status(404).json({ error: "Manufacturer not found" });
            return;
        }
        res.json(updatedManufacturer);
    }
    catch (err) {
        console.error("❌ Error updating manufacturer:", err);
        res.status(500).json({ error: "Failed to update manufacturer" });
    }
});
exports.updateManufacturer = updateManufacturer;
const deleteManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedManufacturer = yield manufacturer_model_1.Manufacturer.findByIdAndDelete(req.params.id);
        if (!deletedManufacturer) {
            res.status(404).json({ error: "Manufacturer not found" });
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        console.error("❌ Error deleting manufacturer:", err);
        res.status(500).json({ error: "Failed to delete manufacturer" });
    }
});
exports.deleteManufacturer = deleteManufacturer;

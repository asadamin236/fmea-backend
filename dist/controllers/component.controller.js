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
exports.deleteComponent = exports.updateComponent = exports.createComponent = exports.getComponentById = exports.getAllComponents = void 0;
const component_model_1 = require("../models/component.model");
const getAllComponents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield component_model_1.Component.find();
    res.json(data);
});
exports.getAllComponents = getAllComponents;
const getComponentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield component_model_1.Component.findById(req.params.id);
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
});
exports.getComponentById = getComponentById;
const createComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newItem = new component_model_1.Component(req.body);
        yield newItem.save();
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ error: "Failed to create", details: err });
    }
});
exports.createComponent = createComponent;
const updateComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield component_model_1.Component.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated)
            return res.status(404).json({ error: "Not found" });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: "Update failed", details: err });
    }
});
exports.updateComponent = updateComponent;
const deleteComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield component_model_1.Component.findByIdAndDelete(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.status(204).send();
});
exports.deleteComponent = deleteComponent;

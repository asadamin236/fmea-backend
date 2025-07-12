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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.createUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const team_model_1 = __importDefault(require("../models/team.model"));
// 👤 Admin creates a user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, teamId } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        if (teamId && !mongoose_1.default.Types.ObjectId.isValid(teamId)) {
            res.status(400).json({ error: "Invalid team ID" });
            return;
        }
        // 🔍 Check for existing email
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "Email already exists" });
            return;
        }
        // ✅ Proceed with user creation
        const user = yield user_model_1.default.create({
            name,
            email,
            password,
            role,
            teamId: teamId || undefined,
        });
        if (teamId) {
            yield team_model_1.default.findByIdAndUpdate(teamId, {
                $addToSet: { members: user._id },
            });
        }
        const populatedUser = yield user_model_1.default.findById(user._id).populate("teamId", "name");
        res.status(201).json(populatedUser);
    }
    catch (err) {
        console.error("User creation error:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});
exports.createUser = createUser;
// 👥 Get all users
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().populate("teamId", "name");
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Server Error", detail: err.message });
    }
});
exports.getAllUsers = getAllUsers;
// ✏️ Update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role, teamId } = req.body;
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        if (teamId && !mongoose_1.default.Types.ObjectId.isValid(teamId)) {
            res.status(400).json({ error: "Invalid team ID" });
            return;
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { name, email, role, teamId }, { new: true }).populate("teamId", "name");
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "User updated", user: updatedUser });
    }
    catch (err) {
        res.status(500).json({ error: "Server Error", detail: err.message });
    }
});
exports.updateUser = updateUser;
// ❌ Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        const deletedUser = yield user_model_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ message: "User deleted", user: deletedUser });
    }
    catch (err) {
        res.status(500).json({ error: "Server Error", detail: err.message });
    }
});
exports.deleteUser = deleteUser;

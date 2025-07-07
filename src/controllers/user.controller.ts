import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Team from "../models/team.model";

// 👤 Admin creates a user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, teamId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (teamId && !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    // 🔍 Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // ✅ Proceed with user creation
    const user = await User.create({
      name,
      email,
      password,
      role,
      teamId: teamId || undefined,
    });

    if (teamId) {
      await Team.findByIdAndUpdate(teamId, {
        $addToSet: { members: user._id },
      });
    }

    const populatedUser = await User.findById(user._id).populate(
      "teamId",
      "name"
    );

    res.status(201).json(populatedUser);
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// 👥 Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().populate("teamId", "name");
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};

// ✏️ Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, teamId } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (teamId && !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, teamId },
      { new: true }
    ).populate("teamId", "name");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated", user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};

// ❌ Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted", user: deletedUser });
  } catch (err: any) {
    res.status(500).json({ error: "Server Error", detail: err.message });
  }
};

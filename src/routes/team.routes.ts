// src/routes/team.routes.ts

import express from "express";
import {
  createTeam,
  getAllTeamsWithMembers,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller";

import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

// ✅ Get all teams (with member counts)
router.get("/", authenticate, getAllTeamsWithMembers);

// ✅ Get single team by ID
router.get("/:id", authenticate, getTeamById);

// ✅ Create a new team (admin only)
router.post("/", authenticate, authorizeRoles("admin"), createTeam);

// ✅ Update a team (admin only)
router.put("/:id", authenticate, authorizeRoles("admin"), updateTeam);

// ✅ Delete a team (admin only)
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteTeam);

export default router;

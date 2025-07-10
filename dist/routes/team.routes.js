"use strict";
// src/routes/team.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("../controllers/team.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const router = express_1.default.Router();
// ✅ Get all teams (with member counts)
router.get("/", authenticate_1.authenticate, team_controller_1.getAllTeamsWithMembers);
// ✅ Get single team by ID
router.get("/:id", authenticate_1.authenticate, team_controller_1.getTeamById);
// ✅ Create a new team (admin only)
router.post("/", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)("admin"), team_controller_1.createTeam);
// ✅ Update a team (admin only)
router.put("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)("admin"), team_controller_1.updateTeam);
// ✅ Delete a team (admin only)
router.delete("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)("admin"), team_controller_1.deleteTeam);
exports.default = router;

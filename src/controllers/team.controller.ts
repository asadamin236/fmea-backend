import { Request, Response } from "express";
import Team from "../models/team.model";
import { AuthenticatedRequest } from "../middlewares/authenticate";
import User from "../models/user.model"; // 👈 Make sure the path is correct


// ✅ Create a team
export const createTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Only admins can create teams" });
      return;
    }

    const { name, description } = req.body;
    if (await Team.findOne({ name })) {
      res.status(409).json({ error: "Team already exists" });
      return;
    }

    const team = await Team.create({ name, description });
    res.status(201).json(team);
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get all teams with member count
// GET /api/teams
export const getAllTeamsWithMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await Team.find().lean();

    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const count = await User.countDocuments({ teamId: team._id }); // ✅ make sure field name is `teamId`
        return {
          ...team,
          memberCount: count,
        };
      })
    );

    res.status(200).json({ teams: teamsWithMembers });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

// ✅ Get team by ID
export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Update team
export const updateTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Only admins can update teams" });
      return;
    }

    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Delete team
export const deleteTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Only admins can delete teams" });
      return;
    }

    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

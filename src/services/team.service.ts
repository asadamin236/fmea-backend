import { Team } from "../models/team.model";
import User from "../models/user.model";
import { Types } from "mongoose";

export const getAllTeams = () =>
  Team.find().populate("members", "name email role").exec();
export const getTeamById = (id: string) =>
  Team.findById(id).populate("members", "name email role").exec();
export const createTeam = (data: any) => Team.create(data);
export const updateTeam = (id: string, data: any) =>
  Team.findByIdAndUpdate(id, data, { new: true }).exec();
export const deleteTeam = (id: string) => Team.findByIdAndDelete(id).exec();

// Add members: merge new user IDs into team.members and set user.teamId
export const addTeamMembers = async (teamId: string, userIds: string[]) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  // Ensure IDs are ObjectId
  const newIds = userIds.map((id) => new Types.ObjectId(id));
  team.members = Array.from(new Set([...team.members, ...newIds]));
  await team.save();

  // Update each User.teamId
  await User.updateMany(
    { _id: { $in: newIds } },
    { $set: { teamId: team._id } }
  );

  return team.populate("members", "name email role");
};

// Remove member
export const removeTeamMember = async (teamId: string, userId: string) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  team.members = team.members.filter((m: any) => m.toString() !== userId);
  await team.save();

  await User.findByIdAndUpdate(userId, { $unset: { teamId: "" } });

  return team.populate("members", "name email role");
};

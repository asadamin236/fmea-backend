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
exports.removeTeamMember = exports.addTeamMembers = exports.deleteTeam = exports.updateTeam = exports.createTeam = exports.getTeamById = exports.getAllTeams = void 0;
const team_model_1 = require("../models/team.model");
const user_model_1 = require("../models/user.model");
const mongoose_1 = require("mongoose");
const getAllTeams = () => team_model_1.Team.find().populate("members", "name email role").exec();
exports.getAllTeams = getAllTeams;
const getTeamById = (id) => team_model_1.Team.findById(id).populate("members", "name email role").exec();
exports.getTeamById = getTeamById;
const createTeam = (data) => team_model_1.Team.create(data);
exports.createTeam = createTeam;
const updateTeam = (id, data) => team_model_1.Team.findByIdAndUpdate(id, data, { new: true }).exec();
exports.updateTeam = updateTeam;
const deleteTeam = (id) => team_model_1.Team.findByIdAndDelete(id).exec();
exports.deleteTeam = deleteTeam;
// Add members: merge new user IDs into team.members and set user.teamId
const addTeamMembers = (teamId, userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findById(teamId);
    if (!team)
        throw new Error("Team not found");
    // Ensure IDs are ObjectId
    const newIds = userIds.map((id) => new mongoose_1.Types.ObjectId(id));
    team.members = Array.from(new Set([...team.members, ...newIds]));
    yield team.save();
    // Update each User.teamId
    yield user_model_1.User.updateMany({ _id: { $in: newIds } }, { $set: { teamId: team._id } });
    return team.populate("members", "name email role");
});
exports.addTeamMembers = addTeamMembers;
// Remove member
const removeTeamMember = (teamId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findById(teamId);
    if (!team)
        throw new Error("Team not found");
    team.members = team.members.filter((m) => m.toString() !== userId);
    yield team.save();
    yield user_model_1.User.findByIdAndUpdate(userId, { $unset: { teamId: "" } });
    return team.populate("members", "name email role");
});
exports.removeTeamMember = removeTeamMember;

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
exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getAllTeamsWithMembers = exports.createTeam = void 0;
const team_model_1 = __importDefault(require("../models/team.model"));
const user_model_1 = __importDefault(require("../models/user.model")); // 👈 Make sure the path is correct
// ✅ Create a team
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({ error: "Only admins can create teams" });
        }
        const { name, description } = req.body;
        if (yield team_model_1.default.findOne({ name })) {
            return res.status(409).json({ error: "Team already exists" });
        }
        const team = yield team_model_1.default.create({ name, description });
        res.status(201).json(team);
    }
    catch (err) {
        console.error("Create Team Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});
exports.createTeam = createTeam;
// ✅ Get all teams with member count
// GET /api/teams
const getAllTeamsWithMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield team_model_1.default.find().lean();
        const teamsWithMembers = yield Promise.all(teams.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield user_model_1.default.countDocuments({ teamId: team._id }); // ✅ make sure field name is `teamId`
            return Object.assign(Object.assign({}, team), { memberCount: count });
        })));
        res.status(200).json({ teams: teamsWithMembers });
    }
    catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});
exports.getAllTeamsWithMembers = getAllTeamsWithMembers;
// ✅ Get team by ID
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield team_model_1.default.findById(req.params.id);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json(team);
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});
exports.getTeamById = getTeamById;
// ✅ Update team
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({ error: "Only admins can update teams" });
        }
        const team = yield team_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json(team);
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});
exports.updateTeam = updateTeam;
// ✅ Delete team
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({ error: "Only admins can delete teams" });
        }
        const team = yield team_model_1.default.findByIdAndDelete(req.params.id);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.json({ message: "Team deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});
exports.deleteTeam = deleteTeam;

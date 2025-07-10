"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use((0, cors_1.default)({
    origin: "*", // You can adjust later to production origin
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const equipmentClass_routes_1 = __importDefault(require("./routes/equipmentClass.routes"));
const equipmentType_routes_1 = __importDefault(require("./routes/equipmentType.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/equipment-class", equipmentClass_routes_1.default);
app.use("/api/equipment-types", equipmentType_routes_1.default);
app.use("/api/teams", team_routes_1.default);
app.use("/api/users", user_routes_1.default);
exports.default = app; // ✅ Export app for serverless use

import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/", authenticate, authorizeRoles("admin"), createUser);
router.get("/", authenticate, authorizeRoles("admin"), getAllUsers);
router.put("/:id", authenticate, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);

export default router;

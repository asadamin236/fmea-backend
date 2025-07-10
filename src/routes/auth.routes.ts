import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup); // ✅ Correct
router.post("/login", login); // ✅ Correct

export default router;

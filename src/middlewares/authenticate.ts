// middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: "admin" | "user" | "editor";
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as AuthenticatedRequest["user"];

    // Optional: debug output to verify token structure
    console.log("✅ Decoded Token:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

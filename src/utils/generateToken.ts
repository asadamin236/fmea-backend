// utils/generateToken.ts
import jwt from "jsonwebtoken";

export const generateToken = (_id: string, role: string) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
};

// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index"; // Express app from your src/index.ts

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as any, res as any); // Wrap express for Vercel
}


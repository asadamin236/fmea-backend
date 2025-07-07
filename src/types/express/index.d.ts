// types/express/index.d.ts
import { UserDocument } from "../../src/models/User"; // adjust if needed

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // or simply: any;
    }
  }
}

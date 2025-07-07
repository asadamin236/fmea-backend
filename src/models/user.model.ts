import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "editor";
  teamId?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite error in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

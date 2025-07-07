import { Schema, model } from "mongoose";

const systemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export const System = model("System", systemSchema);

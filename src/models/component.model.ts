import { Schema, model } from "mongoose";

const componentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    modules: [{ type: String }],
  },
  { timestamps: true }
);

export const Component = model("Component", componentSchema);

import { Schema, model } from "mongoose";

const manufacturerSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    contactInfo: { 
      type: String,
      trim: true 
    },
    website: { 
      type: String,
      trim: true 
    },
  },
  { timestamps: true }
);

export const Manufacturer = model("Manufacturer", manufacturerSchema); 
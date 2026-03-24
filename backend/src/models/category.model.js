import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const categorySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["PRODUCT", "PROJECT"],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageKey: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true }
  },
  baseSchemaOptions
);

export default mongoose.models.Category || mongoose.model("Category", categorySchema);

import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const bannerSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    imageKey: { type: String, default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
  },
  baseSchemaOptions
);

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

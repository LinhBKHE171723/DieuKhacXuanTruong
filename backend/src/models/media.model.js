import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const mediaSchema = new Schema(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    url: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    folder: { type: String, default: "media" },
    altText: { type: String, default: "" },
    provider: { type: String, default: "cloudinary" }
  },
  baseSchemaOptions
);

export default mongoose.models.Media || mongoose.model("Media", mediaSchema);

import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    content: { type: String, default: "" },
    sections: { type: Schema.Types.Mixed, default: {} },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    isPublished: { type: Boolean, default: true }
  },
  baseSchemaOptions
);

export default mongoose.models.Page || mongoose.model("Page", pageSchema);

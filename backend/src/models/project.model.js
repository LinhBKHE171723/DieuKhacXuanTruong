import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const projectSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, required: true },
    content: { type: String, default: "" },
    location: { type: String, default: "" },
    year: { type: String, default: "" },
    scope: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" }
  },
  baseSchemaOptions
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);

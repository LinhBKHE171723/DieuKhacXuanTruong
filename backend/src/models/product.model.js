import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, required: true },
    content: { type: String, default: "" },
    material: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" }
  },
  baseSchemaOptions
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);

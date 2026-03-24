import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const projectImageSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    url: { type: String, required: true },
    key: { type: String, default: null },
    altText: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false }
  },
  baseSchemaOptions
);

export default mongoose.models.ProjectImage || mongoose.model("ProjectImage", projectImageSchema);

import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: { type: String, default: "general" }
  },
  baseSchemaOptions
);

export default mongoose.models.Setting || mongoose.model("Setting", settingSchema);

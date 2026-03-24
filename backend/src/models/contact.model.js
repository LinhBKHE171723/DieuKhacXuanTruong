import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["NEW", "PROCESSED"],
      default: "NEW"
    },
    notes: { type: String, default: "" }
  },
  baseSchemaOptions
);

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);

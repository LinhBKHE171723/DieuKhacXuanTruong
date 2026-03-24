import mongoose from "mongoose";
import { Schema, baseSchemaOptions } from "./common.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "ADMIN"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: Date
  },
  {
    ...baseSchemaOptions,
    toJSON: {
      ...baseSchemaOptions.toJSON,
      transform(document, returned) {
        returned.id = returned._id.toString();
        delete returned._id;
        delete returned.passwordHash;
        return returned;
      }
    }
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

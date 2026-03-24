import mongoose from "mongoose";

export const { Schema } = mongoose;

export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(document, returned) {
      returned.id = returned._id.toString();
      delete returned._id;
      return returned;
    }
  }
};

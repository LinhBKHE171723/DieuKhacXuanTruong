import mongoose from "mongoose";
import { env } from "../config/env.js";

mongoose.set("strictQuery", true);

let listenersRegistered = false;

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  await mongoose.connect(env.mongodbUri, {
    dbName: env.mongodbDbName
  });

  if (!listenersRegistered) {
    listenersRegistered = true;

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  }

  console.log(
    `MongoDB connected: db=${mongoose.connection.name}, host=${mongoose.connection.host}`
  );
};

export default mongoose;

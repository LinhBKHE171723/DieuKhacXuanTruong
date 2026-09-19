import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../../database/connection.js";
import { User } from "../../models/index.js";

const createAdmin = async () => {
  const fullName = process.env.ADMIN_FULL_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!fullName || !email || !password) {
    throw new Error("ADMIN_FULL_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL is invalid.");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  }

  await connectDatabase();

  const existingUser = await User.exists({ email });
  if (existingUser) {
    throw new Error(`An account with email ${email} already exists.`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    fullName,
    email,
    passwordHash,
    role: "ADMIN",
    isActive: true
  });

  console.log(`Admin account created successfully: ${email}`);
};

createAdmin()
  .catch((error) => {
    console.error("Could not create admin account:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

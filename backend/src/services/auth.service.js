import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

export const loginAdmin = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.isActive) {
    throw new ApiError(401, "Email or password is incorrect");
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new ApiError(401, "Email or password is incorrect");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    user: user.toJSON()
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user.toJSON();
};

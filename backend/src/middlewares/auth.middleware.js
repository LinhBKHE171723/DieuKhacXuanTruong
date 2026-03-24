import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      return next(new ApiError(401, "Unauthorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

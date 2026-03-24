import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
};

export const errorHandler = (error, req, res, next) => {
  const shouldLog = !(error instanceof ApiError && error.statusCode < 500);

  if (shouldLog) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.error(error?.stack || error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu gửi lên không hợp lệ.",
      errors: error.flatten(),
      details: error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message
      }))
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error"
  });
};

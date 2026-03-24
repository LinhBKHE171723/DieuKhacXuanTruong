import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new ApiError(400, "Only image files are allowed"));
    }
    cb(null, true);
  }
});

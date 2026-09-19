import path from "node:path";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let isConfigured = false;

const ensureCloudinaryConfigured = () => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new ApiError(
      500,
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true
    });
    isConfigured = true;
  }
};

const sanitizePathPart = (value, fallback) => {
  const sanitized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return sanitized || fallback;
};

const buildPublicId = (folder, originalName) => {
  const extension = path.extname(originalName || "");
  const baseName = path.basename(originalName || "upload", extension);
  const safeFolder = sanitizePathPart(folder, "media");
  const safeBaseName = sanitizePathPart(baseName, "upload");

  return `${safeFolder}/${Date.now()}-${randomUUID()}-${safeBaseName}`;
};

const buildCloudinaryErrorDetails = (error) => ({
  name: error?.name || null,
  message: error?.message || null,
  httpCode: error?.http_code || null
});

export const uploadBufferToCloudinary = async ({ buffer, originalName, folder }) => {
  ensureCloudinaryConfigured();
  const publicId = buildPublicId(folder, originalName);

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "image",
          overwrite: false
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(uploadResult);
        }
      );

      uploadStream.end(buffer);
    });

    return {
      key: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    const details = buildCloudinaryErrorDetails(error);
    console.error("Cloudinary upload failed", details);
    throw new ApiError(
      500,
      `Khong the tai anh len Cloudinary. ${error?.message || "Vui long kiem tra cau hinh Cloudinary."}`,
      details
    );
  }
};

export const deleteFileFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  ensureCloudinaryConfigured();

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true
    });
  } catch (error) {
    const details = buildCloudinaryErrorDetails(error);
    console.error("Cloudinary delete failed", details);
    throw new ApiError(
      500,
      `Khong the xoa anh tren Cloudinary. ${error?.message || "Vui long kiem tra cau hinh Cloudinary."}`,
      details
    );
  }
};

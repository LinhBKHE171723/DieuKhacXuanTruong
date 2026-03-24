import path from "node:path";
import { ApiError } from "./apiError.js";

export const BANNER_IMAGE_SPEC = {
  width: 1280,
  height: 720,
  quality: 86
};

export const GALLERY_IMAGE_SPEC = {
  width: 1600,
  height: 1200,
  quality: 84,
  background: {
    r: 247,
    g: 241,
    b: 231,
    alpha: 1
  }
};

const withExtension = (fileName, extension) => {
  const parsed = path.parse(fileName || "upload");
  return `${parsed.name || "upload"}${extension}`;
};

const bannerMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const galleryMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const BANNER_ASPECT_RATIO = BANNER_IMAGE_SPEC.width / BANNER_IMAGE_SPEC.height;
const BANNER_ASPECT_TOLERANCE = 0.015;

let sharpLoader;

const getSharp = async () => {
  if (!sharpLoader) {
    sharpLoader = import("sharp")
      .then((module) => module.default || module)
      .catch(() => null);
  }

  return sharpLoader;
};

const getSharpInstallMessage = (label) =>
  `Khong the xu ly anh ${label} vi thu vien sharp chua duoc cai dung cho moi truong hien tai. Neu ban dang chay backend bang PowerShell tren Windows, vao thu muc backend va chay: npm install --os=win32 --cpu=x64 sharp`;

const normalizeBannerImage = async (file) => {
  if (!bannerMimeTypes.has(file.mimetype)) {
    throw new ApiError(400, "Ảnh banner chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.");
  }

  const sharp = await getSharp();
  if (!sharp) {
    throw new ApiError(500, getSharpInstallMessage("banner"));
  }

  try {
    const image = sharp(file.buffer, { failOn: "none" }).rotate();
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new ApiError(400, "Không thể đọc kích thước ảnh banner.");
    }

    const ratio = metadata.width / metadata.height;
    if (Math.abs(ratio - BANNER_ASPECT_RATIO) > BANNER_ASPECT_TOLERANCE) {
      throw new ApiError(
        400,
        `Ảnh banner phải đúng ti le 16:9, vi du ${BANNER_IMAGE_SPEC.width} x ${BANNER_IMAGE_SPEC.height}, 1600 x 900 hoac 1920 x 1080 px.`
      );
    }

    const buffer = await image
      .resize(BANNER_IMAGE_SPEC.width, BANNER_IMAGE_SPEC.height, {
        fit: "cover",
        position: "center"
      })
      .webp({ quality: BANNER_IMAGE_SPEC.quality })
      .toBuffer();

    return {
      buffer,
      mimeType: "image/webp",
      originalName: withExtension(file.originalname, ".webp"),
      size: buffer.length,
      width: BANNER_IMAGE_SPEC.width,
      height: BANNER_IMAGE_SPEC.height
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      400,
      "Không thể xử lý ảnh banner. Vui lòng dùng ảnh JPG, PNG hoặc WEBP đúng ti le 16:9."
    );
  }
};

const normalizeGalleryImage = async (file, label) => {
  if (!galleryMimeTypes.has(file.mimetype)) {
    throw new ApiError(400, `Ảnh ${label} chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.`);
  }

  const sharp = await getSharp();
  if (!sharp) {
    throw new ApiError(500, getSharpInstallMessage(label));
  }

  try {
    const image = sharp(file.buffer, { failOn: "none" }).rotate();
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new ApiError(400, `Không thể đọc kích thước ảnh ${label}.`);
    }

    const buffer = await image
      .resize(GALLERY_IMAGE_SPEC.width, GALLERY_IMAGE_SPEC.height, {
        fit: "contain",
        background: GALLERY_IMAGE_SPEC.background,
        withoutEnlargement: true
      })
      .webp({ quality: GALLERY_IMAGE_SPEC.quality })
      .toBuffer();

    return {
      buffer,
      mimeType: "image/webp",
      originalName: withExtension(file.originalname, ".webp"),
      size: buffer.length,
      width: GALLERY_IMAGE_SPEC.width,
      height: GALLERY_IMAGE_SPEC.height
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      400,
      `Không thể xử lý ảnh ${label}. Vui lòng dùng ảnh JPG, PNG hoặc WEBP hợp lệ.`
    );
  }
};

export const prepareImageUpload = async ({ file, folder }) => {
  if (folder === "banners") {
    return normalizeBannerImage(file);
  }

  if (folder === "products") {
    return normalizeGalleryImage(file, "san pham");
  }

  if (folder === "projects") {
    return normalizeGalleryImage(file, "cong trinh");
  }

  if (folder === "pages") {
    return normalizeGalleryImage(file, "bai viet");
  }

  return {
    buffer: file.buffer,
    mimeType: file.mimetype,
    originalName: file.originalname,
    size: file.size,
    width: null,
    height: null
  };
};

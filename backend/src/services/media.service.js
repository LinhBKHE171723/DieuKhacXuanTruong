import { Media } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { sanitizePlainText } from "../utils/sanitize.js";
import { escapeRegex } from "../utils/query.js";
import { prepareImageUpload } from "../utils/imageProcessor.js";
import { deleteFileFromS3, uploadBufferToS3 } from "./s3.service.js";

const serializeMedia = (media) => media.toJSON();

export const getMediaList = async (query = {}) => {
  const { page, limit, offset } = getPagination(query.page, query.limit || 18);
  const where = {};

  if (query.search) {
    where.originalName = new RegExp(escapeRegex(query.search.trim()), "i");
  }

  const [count, rows] = await Promise.all([
    Media.countDocuments(where),
    Media.find(where)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
  ]);

  return {
    items: rows.map(serializeMedia),
    pagination: buildPaginationMeta(count, page, limit)
  };
};

export const uploadMediaFiles = async ({ files, folder }) => {
  if (!files?.length) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploaded = [];
  for (const file of files) {
    const preparedFile = await prepareImageUpload({ file, folder });
    const s3File = await uploadBufferToS3({
      buffer: preparedFile.buffer,
      mimeType: preparedFile.mimeType,
      originalName: preparedFile.originalName,
      folder
    });

    const media = await Media.create({
      originalName: preparedFile.originalName,
      fileName: sanitizePlainText(preparedFile.originalName),
      mimeType: preparedFile.mimeType,
      size: preparedFile.size,
      width: preparedFile.width,
      height: preparedFile.height,
      url: s3File.url,
      key: s3File.key,
      folder: folder || "media"
    });

    uploaded.push(serializeMedia(media));
  }

  return uploaded;
};

export const deleteMediaById = async (id) => {
  const media = await Media.findById(id);
  if (!media) {
    throw new ApiError(404, "Media not found");
  }

  await deleteFileFromS3(media.key);
  await media.deleteOne();
};

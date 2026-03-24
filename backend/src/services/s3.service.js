import path from "node:path";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let s3Client;

const ensureS3Configured = () => {
  if (!env.awsRegion || !env.awsBucket || !env.awsAccessKeyId || !env.awsSecretAccessKey) {
    throw new ApiError(500, "AWS S3 is not configured. Please set AWS env variables.");
  }
};

const getClient = () => {
  if (!s3Client) {
    ensureS3Configured();
    s3Client = new S3Client({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey
      }
    });
  }

  return s3Client;
};

const buildKey = (folder, originalName) => {
  const extension = path.extname(originalName || "").toLowerCase();
  const baseName = path.basename(originalName || "upload", extension).replace(/\s+/g, "-").toLowerCase();
  const safeFolder = folder?.replace(/^\/+|\/+$/g, "") || "media";
  return `${safeFolder}/${Date.now()}-${randomUUID()}-${baseName}${extension}`;
};

const buildUrl = (key) => {
  if (env.awsPublicBaseUrl) {
    return `${env.awsPublicBaseUrl.replace(/\/$/, "")}/${key}`;
  }

  return `https://${env.awsBucket}.s3.${env.awsRegion}.amazonaws.com/${key}`;
};

export const uploadBufferToS3 = async ({ buffer, mimeType, originalName, folder }) => {
  ensureS3Configured();
  const key = buildKey(folder, originalName);

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: env.awsBucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType
      })
    );
  } catch (error) {
    const message =
      error?.name === "AccessDenied"
        ? "Khong the tai anh len S3. AWS dang tu choi quyen PutObject, vui long kiem tra IAM policy va bucket policy."
        : error?.name === "InvalidAccessKeyId" || error?.name === "SignatureDoesNotMatch"
          ? "Khong the tai anh len S3. AWS credentials khong hop le, vui long kiem tra ACCESS KEY, SECRET KEY va REGION."
          : `Khong the tai anh len S3. ${error?.message || "Vui long kiem tra cau hinh AWS va log server."}`;

    throw new ApiError(500, message);
  }

  return {
    key,
    url: buildUrl(key)
  };
};

export const deleteFileFromS3 = async (key) => {
  if (!key) {
    return;
  }

  ensureS3Configured();
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: env.awsBucket,
      Key: key
    })
  );
};

import path from "node:path";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let s3Client;

const getS3ErrorMessage = (error) => {
  switch (error?.name) {
    case "AccessDenied":
      return "Khong the tai anh len S3. AWS dang tu choi quyen PutObject, vui long kiem tra IAM policy va bucket policy.";
    case "InvalidAccessKeyId":
    case "SignatureDoesNotMatch":
    case "CredentialsProviderError":
      return "Khong the tai anh len S3. AWS credentials khong hop le, vui long kiem tra ACCESS KEY, SECRET KEY va REGION.";
    case "NoSuchBucket":
      return "Khong the tai anh len S3. Bucket khong ton tai hoac ten bucket dang sai.";
    case "RequestTimeTooSkewed":
      return "Khong the tai anh len S3. Thoi gian tren VPS dang lech qua nhieu, vui long dong bo gio he thong.";
    case "TimeoutError":
    case "NetworkingError":
      return "Khong the tai anh len S3. VPS khong ket noi duoc toi AWS, vui long kiem tra mang va DNS.";
    default:
      return `Khong the tai anh len S3. ${error?.message || "Vui long kiem tra cau hinh AWS va log server."}`;
  }
};

const buildS3ErrorDetails = (error) => ({
  name: error?.name || null,
  code: error?.code || error?.Code || null,
  message: error?.message || null,
  httpStatusCode: error?.$metadata?.httpStatusCode || null,
  requestId: error?.$metadata?.requestId || error?.$response?.requestId || null
});

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
    console.error("S3 upload failed", buildS3ErrorDetails(error));
    throw new ApiError(500, getS3ErrorMessage(error), buildS3ErrorDetails(error));
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

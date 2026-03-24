import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const toArray = (value) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  appUrl: process.env.APP_URL || "http://localhost:5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  mongodbUri: process.env.MONGODB_URI || "",
  mongodbDbName: process.env.MONGODB_DB_NAME || "dieu_khac",
  awsRegion: process.env.AWS_REGION || "",
  awsBucket: process.env.AWS_S3_BUCKET || "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  awsPublicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL || "",
  allowedOrigins: toArray(process.env.ALLOWED_ORIGINS)
};

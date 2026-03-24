import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../database/connection.js";
import { User } from "../models/index.js";

const readArg = (name) => {
  const direct = process.argv.find((item) => item.startsWith(`--${name}=`));
  if (direct) {
    return direct.slice(name.length + 3).trim();
  }

  const index = process.argv.findIndex((item) => item === `--${name}`);
  if (index >= 0) {
    return `${process.argv[index + 1] || ""}`.trim();
  }

  return "";
};

const printUsage = () => {
  console.log("Usage:");
  console.log('npm run admin:create -- --email "admin@example.com" --password "YourStrongPassword" --name "Admin Name"');
};

const createAdmin = async () => {
  const email = readArg("email").toLowerCase();
  const password = readArg("password");
  const fullName = readArg("name") || "Admin";

  if (!email || !password) {
    printUsage();
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Mat khau phai co it nhat 8 ky tu.");
    process.exit(1);
  }

  await connectDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.error(`Tai khoan ${email} da ton tai.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role: "ADMIN",
    isActive: true
  });

  console.log(`Da tao tai khoan admin moi: ${user.email}`);
  await mongoose.connection.close();
  process.exit(0);
};

createAdmin().catch(async (error) => {
  console.error("Khong the tao tai khoan admin moi.", error);
  try {
    await mongoose.connection.close();
  } catch {
    // no-op
  }
  process.exit(1);
});

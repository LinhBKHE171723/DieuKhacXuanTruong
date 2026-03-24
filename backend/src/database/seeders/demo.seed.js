import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../../database/connection.js";
import {
  Banner,
  Category,
  Page,
  Product,
  ProductImage,
  Project,
  ProjectImage,
  Setting,
  User
} from "../../models/index.js";
import {
  bannerSeed,
  categorySeed,
  demoSettings,
  makeSlug,
  pageSeed,
  productSeed,
  projectSeed
} from "./demo.data.js";

const seed = async () => {
  await connectDatabase();
  await mongoose.connection.db.dropDatabase();

  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  await User.create({
    fullName: "System Admin",
    email: "admin@dieu-khac.vn",
    passwordHash: adminPassword,
    role: "ADMIN",
    isActive: true
  });

  const createdCategories = await Category.insertMany(
    categorySeed.map((item) => ({
      ...item,
      slug: makeSlug(item.name)
    }))
  );

  const categoryMap = createdCategories.reduce((accumulator, item) => {
    accumulator[item.name] = item;
    return accumulator;
  }, {});

  await Setting.insertMany(
    Object.entries(demoSettings).map(([key, value]) => ({
      key,
      value
    }))
  );

  await Page.insertMany(pageSeed);

  await Banner.insertMany(bannerSeed);

  for (const item of productSeed) {
    const product = await Product.create({
      categoryId: categoryMap[item.categoryName]._id,
      name: item.name,
      slug: makeSlug(item.name),
      shortDescription: item.shortDescription,
      content: item.content,
      material: item.material,
      dimensions: item.dimensions,
      tags: item.tags,
      isFeatured: item.isFeatured || false,
      isVisible: true,
      sortOrder: item.sortOrder
    });

    await ProductImage.insertMany(
      item.images.map((entry) => ({
        productId: product._id,
        ...entry
      }))
    );
  }

  for (const item of projectSeed) {
    const project = await Project.create({
      categoryId: categoryMap[item.categoryName]?._id || null,
      name: item.name,
      slug: makeSlug(item.name),
      shortDescription: item.shortDescription,
      content: item.content,
      location: item.location,
      year: item.year,
      scope: item.scope,
      isFeatured: item.isFeatured || false,
      isVisible: true,
      sortOrder: item.sortOrder
    });

    await ProjectImage.insertMany(
      item.images.map((entry) => ({
        projectId: project._id,
        ...entry
      }))
    );
  }

  console.log("Seed completed successfully");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error("Seed failed", error);
  try {
    await mongoose.connection.close();
  } catch {
    // no-op
  }
  process.exit(1);
});

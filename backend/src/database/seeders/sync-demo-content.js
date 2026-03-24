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
  Setting
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

const syncSettings = async () => {
  await Promise.all(
    Object.entries(demoSettings).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );
};

const syncCategories = async () => {
  const categoryMap = {};

  for (const item of categorySeed) {
    const slug = makeSlug(item.name);
    const category = await Category.findOneAndUpdate(
      { slug, type: item.type },
      { ...item, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    categoryMap[item.name] = category;
  }

  return categoryMap;
};

const syncPages = async () => {
  for (const page of pageSeed) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      page,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

const syncBanners = async () => {
  for (const banner of bannerSeed) {
    const existing = await Banner.findOne({ sortOrder: banner.sortOrder });

    if (existing) {
      existing.set(banner);
      await existing.save();
      continue;
    }

    await Banner.create(banner);
  }
};

const syncProducts = async (categoryMap) => {
  for (const item of productSeed) {
    const slug = makeSlug(item.name);
    const payload = {
      categoryId: categoryMap[item.categoryName]?._id || null,
      name: item.name,
      slug,
      shortDescription: item.shortDescription,
      content: item.content,
      material: item.material,
      dimensions: item.dimensions,
      tags: item.tags,
      isFeatured: item.isFeatured || false,
      isVisible: true,
      sortOrder: item.sortOrder
    };

    let product = await Product.findOne({ slug });
    if (product) {
      product.set(payload);
      await product.save();
    } else {
      product = await Product.create(payload);
    }

    await ProductImage.deleteMany({ productId: product._id });
    await ProductImage.insertMany(
      item.images.map((entry) => ({
        productId: product._id,
        ...entry
      }))
    );
  }
};

const syncProjects = async (categoryMap) => {
  for (const item of projectSeed) {
    const slug = makeSlug(item.name);
    const payload = {
      categoryId: categoryMap[item.categoryName]?._id || null,
      name: item.name,
      slug,
      shortDescription: item.shortDescription,
      content: item.content,
      location: item.location,
      year: item.year,
      scope: item.scope,
      isFeatured: item.isFeatured || false,
      isVisible: true,
      sortOrder: item.sortOrder
    };

    let project = await Project.findOne({ slug });
    if (project) {
      project.set(payload);
      await project.save();
    } else {
      project = await Project.create(payload);
    }

    await ProjectImage.deleteMany({ projectId: project._id });
    await ProjectImage.insertMany(
      item.images.map((entry) => ({
        projectId: project._id,
        ...entry
      }))
    );
  }
};

const syncDemoContent = async () => {
  await connectDatabase();

  const categoryMap = await syncCategories();
  await Promise.all([syncSettings(), syncPages(), syncBanners()]);
  await syncProducts(categoryMap);
  await syncProjects(categoryMap);

  console.log("Demo content synced successfully");
  await mongoose.connection.close();
  process.exit(0);
};

syncDemoContent().catch(async (error) => {
  console.error("Demo content sync failed", error);
  try {
    await mongoose.connection.close();
  } catch {
    // no-op
  }
  process.exit(1);
});

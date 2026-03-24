import { Banner, Category, Contact, Product, Project } from "../models/index.js";

export const getDashboardSummary = async () => {
  const [products, categories, projects, contacts, banners] = await Promise.all([
    Product.countDocuments({}),
    Category.countDocuments({ type: "PRODUCT" }),
    Project.countDocuments({}),
    Contact.countDocuments({}),
    Banner.countDocuments({})
  ]);

  return {
    products,
    categories,
    projects,
    contacts,
    banners
  };
};

import { getActiveBanners } from "./banner.service.js";
import { getCategories } from "./category.service.js";
import { getPageBySlug } from "./page.service.js";
import { getProducts, getProductBySlug } from "./product.service.js";
import { getProjects, getProjectBySlug } from "./project.service.js";
import { getSettingsObject } from "./setting.service.js";

export const getHomepageData = async () => {
  const [settings, banners, homepage, featuredCategories, featuredProducts, featuredProjects] =
    await Promise.all([
      getSettingsObject(),
      getActiveBanners(),
      getPageBySlug("home", true),
      getCategories({ type: "PRODUCT", featured: true, limit: "all" }, true),
      getProducts({ featured: true, limit: 6 }, true),
      getProjects({ featured: true, limit: 6 }, true)
    ]);

  return {
    settings,
    banners,
    homepage,
    featuredCategories: featuredCategories.items,
    featuredProducts: featuredProducts.items,
    featuredProjects: featuredProjects.items
  };
};

export const getWebsiteSettings = async () => getSettingsObject();
export const getAboutPage = async () => getPageBySlug("about", true);
export const getPublicProducts = async (query) => getProducts(query, true);
export const getPublicProductDetail = async (slug) => getProductBySlug(slug);
export const getPublicProjects = async (query) => getProjects(query, true);
export const getPublicProjectDetail = async (slug) => getProjectBySlug(slug);
export const getPublicCategories = async (query) => getCategories(query, true);

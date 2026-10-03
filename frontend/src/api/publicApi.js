import client from "./client";
import { localPortfolioEnabled, localProjects, findLocalDetail } from "../data/localPortfolio";

const unwrap = (response) => response.data.data;

export const publicApi = {
  getHome: async () => {
    const data = unwrap(await client.get("/public/home"));
    return localPortfolioEnabled ? { ...data, featuredProjects: [...localProjects, ...(data.featuredProjects || [])] } : data;
  },
  getAbout: async () => unwrap(await client.get("/public/about")),
  getSettings: async () => unwrap(await client.get("/public/settings")),
  getCategories: async (params = {}) => unwrap(await client.get("/public/categories", { params })),
  getProducts: async (params = {}) => unwrap(await client.get("/public/products", { params })),
  getProductDetail: async (slug) => unwrap(await client.get(`/public/products/${slug}`)),
  getProjects: async (params = {}) => {
    const data = unwrap(await client.get("/public/projects", { params }));
    return localPortfolioEnabled && Number(params.page || 1) === 1 ? { ...data, items: [...localProjects, ...(data.items || [])] } : data;
  },
  getProjectDetail: async (slug) => findLocalDetail(localProjects, slug, "relatedProjects") || unwrap(await client.get(`/public/projects/${slug}`)),
  createContact: async (payload) => unwrap(await client.post("/public/contacts", payload))
};

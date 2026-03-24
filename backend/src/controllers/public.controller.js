import { createPublicContact } from "./contact.controller.js";
import {
  getAboutPage,
  getHomepageData,
  getPublicCategories,
  getPublicProductDetail,
  getPublicProducts,
  getPublicProjectDetail,
  getPublicProjects,
  getWebsiteSettings
} from "../services/public.service.js";

export const getHome = async (req, res) => {
  const data = await getHomepageData();
  res.json({ success: true, data });
};

export const getAbout = async (req, res) => {
  const data = await getAboutPage();
  res.json({ success: true, data });
};

export const getSettings = async (req, res) => {
  const data = await getWebsiteSettings();
  res.json({ success: true, data });
};

export const getCategories = async (req, res) => {
  const data = await getPublicCategories(req.query);
  res.json({ success: true, data });
};

export const getProducts = async (req, res) => {
  const data = await getPublicProducts(req.query);
  res.json({ success: true, data });
};

export const getProductDetail = async (req, res) => {
  const data = await getPublicProductDetail(req.params.slug);
  res.json({ success: true, data });
};

export const getProjects = async (req, res) => {
  const data = await getPublicProjects(req.query);
  res.json({ success: true, data });
};

export const getProjectDetail = async (req, res) => {
  const data = await getPublicProjectDetail(req.params.slug);
  res.json({ success: true, data });
};

export { createPublicContact };

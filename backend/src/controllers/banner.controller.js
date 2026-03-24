import {
  createBanner,
  deleteBanner,
  getAdminBanners,
  getBannerById,
  reorderBanners,
  updateBanner
} from "../services/banner.service.js";

export const listBanners = async (req, res) => {
  const data = await getAdminBanners(req.query);
  res.json({ success: true, data });
};

export const getBanner = async (req, res) => {
  const data = await getBannerById(req.params.id);
  res.json({ success: true, data });
};

export const storeBanner = async (req, res) => {
  const data = await createBanner(req.validated.body);
  res.status(201).json({ success: true, message: "Banner created", data });
};

export const editBanner = async (req, res) => {
  const data = await updateBanner(req.params.id, req.validated.body);
  res.json({ success: true, message: "Banner updated", data });
};

export const sortBanners = async (req, res) => {
  const data = await reorderBanners(req.validated.body.items);
  res.json({ success: true, message: "Banner order updated", data });
};

export const destroyBanner = async (req, res) => {
  await deleteBanner(req.params.id);
  res.json({ success: true, message: "Banner deleted" });
};

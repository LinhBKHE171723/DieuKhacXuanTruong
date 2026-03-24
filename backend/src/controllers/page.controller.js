import { getPageBySlug, getPages, updatePageBySlug } from "../services/page.service.js";

export const listPages = async (req, res) => {
  const data = await getPages();
  res.json({ success: true, data });
};

export const getPage = async (req, res) => {
  const data = await getPageBySlug(req.params.slug);
  res.json({ success: true, data });
};

export const editPage = async (req, res) => {
  const data = await updatePageBySlug(req.params.slug, req.validated.body);
  res.json({ success: true, message: "Page updated", data });
};

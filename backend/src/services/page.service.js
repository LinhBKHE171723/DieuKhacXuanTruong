import { Page } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { sanitizePlainText, sanitizeRichText } from "../utils/sanitize.js";

const serializePage = (page) => page.toJSON();
const sanitizeUrlValue = (value) => (typeof value === "string" ? value.trim() : "");

const sanitizeHomeSections = (sections = {}) => ({
  introBadge: sanitizePlainText(sections.introBadge || ""),
  introTitle: sanitizePlainText(sections.introTitle || ""),
  introDescription: sanitizePlainText(sections.introDescription || ""),
  reasonTitle: sanitizePlainText(sections.reasonTitle || ""),
  stats: Array.isArray(sections.stats)
    ? sections.stats.map((item) => ({
        label: sanitizePlainText(item?.label || ""),
        value: sanitizePlainText(item?.value || "")
      }))
    : [],
  reasons: Array.isArray(sections.reasons)
    ? sections.reasons.map((item) => ({
        title: sanitizePlainText(item?.title || ""),
        description: sanitizePlainText(item?.description || "")
      }))
    : [],
  cta: {
    title: sanitizePlainText(sections.cta?.title || ""),
    description: sanitizePlainText(sections.cta?.description || ""),
    primaryText: sanitizePlainText(sections.cta?.primaryText || ""),
    primaryLink: sanitizeUrlValue(sections.cta?.primaryLink),
    secondaryText: sanitizePlainText(sections.cta?.secondaryText || ""),
    secondaryLink: sanitizeUrlValue(sections.cta?.secondaryLink)
  }
});

const sanitizeAboutSections = (sections = {}) => ({
  vision: sanitizePlainText(sections.vision || ""),
  mission: sanitizePlainText(sections.mission || ""),
  capabilities: Array.isArray(sections.capabilities)
    ? sections.capabilities.map((value) => sanitizePlainText(value || "")).filter(Boolean)
    : [],
  values: Array.isArray(sections.values)
    ? sections.values.map((item) => ({
        title: sanitizePlainText(item?.title || ""),
        description: sanitizePlainText(item?.description || "")
      }))
    : [],
  stories: Array.isArray(sections.stories)
    ? sections.stories.map((story) => ({
        title: sanitizePlainText(story?.title || ""),
        slug: sanitizePlainText(story?.slug || ""),
        tag: sanitizePlainText(story?.tag || ""),
        summary: sanitizePlainText(story?.summary || ""),
        imageUrl: sanitizeUrlValue(story?.imageUrl),
        imageKey: sanitizeUrlValue(story?.imageKey),
        imageAlt: sanitizePlainText(story?.imageAlt || ""),
        content: sanitizeRichText(story?.content || "")
      }))
    : []
});

const sanitizeSectionsBySlug = (slug, sections = {}) => {
  if (slug === "home") {
    return sanitizeHomeSections(sections);
  }

  if (slug === "about") {
    return sanitizeAboutSections(sections);
  }

  return sections || {};
};

export const getPages = async () => {
  const pages = await Page.find({}).sort({ slug: 1 });
  return pages.map(serializePage);
};

export const getPageBySlug = async (slug, publicOnly = false) => {
  const where = { slug };
  if (publicOnly) {
    where.isPublished = true;
  }

  const page = await Page.findOne(where);
  if (!page) {
    throw new ApiError(404, "Page not found");
  }
  return serializePage(page);
};

export const updatePageBySlug = async (slug, payload) => {
  const page = await Page.findOne({ slug });
  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  page.set({
    title: sanitizePlainText(payload.title),
    heroTitle: sanitizePlainText(payload.heroTitle || ""),
    heroSubtitle: sanitizePlainText(payload.heroSubtitle || ""),
    content: sanitizeRichText(payload.content || ""),
    sections: sanitizeSectionsBySlug(slug, payload.sections || {}),
    metaTitle: sanitizePlainText(payload.metaTitle || ""),
    metaDescription: sanitizePlainText(payload.metaDescription || ""),
    isPublished: payload.isPublished
  });
  await page.save();

  return serializePage(page);
};

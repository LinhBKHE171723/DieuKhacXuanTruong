import { Category, Project, ProjectImage } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { ensureUniqueSlug } from "../utils/slug.js";
import { sanitizePlainText, sanitizeRichText } from "../utils/sanitize.js";
import { escapeRegex } from "../utils/query.js";

const normalizeImages = (images = []) => {
  const normalized = images.map((image, index) => ({
    url: image.url,
    key: image.key || null,
    altText: sanitizePlainText(image.altText || ""),
    sortOrder: Number.isFinite(Number(image.sortOrder)) ? Number(image.sortOrder) : index,
    isPrimary: Boolean(image.isPrimary)
  }));

  if (normalized.length && !normalized.some((image) => image.isPrimary)) {
    normalized[0].isPrimary = true;
  }

  return normalized;
};

const mapById = (items = []) =>
  items.reduce((accumulator, item) => {
    accumulator[item.id] = item;
    return accumulator;
  }, {});

const attachRelations = async (projects) => {
  if (!projects.length) {
    return [];
  }

  const projectDocs = projects.map((project) => project.toJSON());
  const projectIds = projects.map((project) => project._id);
  const categoryIds = [...new Set(projectDocs.map((project) => project.categoryId?.toString()).filter(Boolean))];

  const [categories, images] = await Promise.all([
    Category.find({ _id: { $in: categoryIds } }),
    ProjectImage.find({ projectId: { $in: projectIds } }).sort({ sortOrder: 1, createdAt: 1 })
  ]);

  const categoryMap = mapById(categories.map((item) => item.toJSON()));
  const imageMap = images.reduce((accumulator, image) => {
    const serialized = image.toJSON();
    const key = serialized.projectId.toString();
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(serialized);
    return accumulator;
  }, {});

  return projectDocs.map((project) => {
    const relatedImages = imageMap[project.id] || [];
    return {
      ...project,
      category: project.categoryId ? categoryMap[project.categoryId.toString()] || null : null,
      images: relatedImages,
      thumbnail: relatedImages.find((image) => image.isPrimary)?.url || relatedImages[0]?.url || null
    };
  });
};

const buildWhere = (query = {}, publicOnly = false) => {
  const where = {};
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.search) {
    where.name = new RegExp(escapeRegex(query.search.trim()), "i");
  }
  if (query.featured === "true" || query.featured === true) {
    where.isFeatured = true;
  }
  if (publicOnly) {
    where.isVisible = true;
  }
  return where;
};

export const getProjects = async (query = {}, publicOnly = false) => {
  const { page, limit, offset } = getPagination(query.page, query.limit || 9);
  const where = buildWhere(query, publicOnly);
  const [count, rows] = await Promise.all([
    Project.countDocuments(where),
    Project.find(where)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
  ]);
  const items = await attachRelations(rows);

  return {
    items,
    pagination: buildPaginationMeta(count, page, limit)
  };
};

export const getProjectById = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const [serialized] = await attachRelations([project]);
  return serialized;
};

export const getProjectBySlug = async (slug) => {
  const project = await Project.findOne({ slug, isVisible: true });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const [serialized] = await attachRelations([project]);
  const relatedProjects = await Project.find({
    isVisible: true,
    _id: { $ne: project._id }
  })
    .sort({ isFeatured: -1, sortOrder: 1 })
    .limit(4);

  return {
    ...serialized,
    relatedProjects: await attachRelations(relatedProjects)
  };
};

export const createProject = async (payload) => {
  const slug = await ensureUniqueSlug(Project, payload.slug || payload.name);
  const project = await Project.create({
    ...payload,
    slug,
    name: sanitizePlainText(payload.name),
    shortDescription: sanitizePlainText(payload.shortDescription),
    content: sanitizeRichText(payload.content || ""),
    location: sanitizePlainText(payload.location || ""),
    year: sanitizePlainText(payload.year || ""),
    scope: sanitizePlainText(payload.scope || ""),
    metaTitle: sanitizePlainText(payload.metaTitle || ""),
    metaDescription: sanitizePlainText(payload.metaDescription || "")
  });

  const images = normalizeImages(payload.images);
  if (images.length) {
    await ProjectImage.insertMany(
      images.map((image) => ({
        ...image,
        projectId: project._id
      }))
    );
  }

  return getProjectById(project.id);
};

export const updateProject = async (id, payload) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const slug = await ensureUniqueSlug(Project, payload.slug || payload.name, id);
  project.set({
    ...payload,
    slug,
    name: sanitizePlainText(payload.name),
    shortDescription: sanitizePlainText(payload.shortDescription),
    content: sanitizeRichText(payload.content || ""),
    location: sanitizePlainText(payload.location || ""),
    year: sanitizePlainText(payload.year || ""),
    scope: sanitizePlainText(payload.scope || ""),
    metaTitle: sanitizePlainText(payload.metaTitle || ""),
    metaDescription: sanitizePlainText(payload.metaDescription || "")
  });
  await project.save();

  await ProjectImage.deleteMany({ projectId: project._id });
  const images = normalizeImages(payload.images);
  if (images.length) {
    await ProjectImage.insertMany(
      images.map((image) => ({
        ...image,
        projectId: project._id
      }))
    );
  }

  return getProjectById(project.id);
};

export const deleteProject = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await ProjectImage.deleteMany({ projectId: project._id });
  await project.deleteOne();
};

import { Category } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import { ensureUniqueSlug } from "../utils/slug.js";
import { sanitizePlainText } from "../utils/sanitize.js";
import { escapeRegex } from "../utils/query.js";

const buildCategoryWhere = (query = {}, publicOnly = false) => {
  const where = {};

  if (query.type) {
    where.type = query.type;
  }

  if (query.search) {
    where.name = new RegExp(escapeRegex(query.search.trim()), "i");
  }

  if (publicOnly) {
    where.isVisible = true;
  }

  if (query.featured === "true" || query.featured === true) {
    where.isFeatured = true;
  }

  return where;
};

const serializeCategory = (category) => category.toJSON();

export const getCategories = async (query = {}, publicOnly = false) => {
  if (publicOnly && query.limit === "all") {
    const rows = await Category.find(buildCategoryWhere(query, true)).sort({ sortOrder: 1, createdAt: -1 });

    return { items: rows.map(serializeCategory) };
  }

  const { page, limit, offset } = getPagination(query.page, query.limit || 20);
  const where = buildCategoryWhere(query, publicOnly);
  const [count, rows] = await Promise.all([
    Category.countDocuments(where),
    Category.find(where)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
  ]);

  return {
    items: rows.map(serializeCategory),
    pagination: buildPaginationMeta(count, page, limit)
  };
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return serializeCategory(category);
};

export const createCategory = async (payload) => {
  const slug = await ensureUniqueSlug(Category, payload.slug || payload.name);
  const category = await Category.create({
    ...payload,
    slug,
    name: sanitizePlainText(payload.name),
    description: sanitizePlainText(payload.description || "")
  });
  return serializeCategory(category);
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const slug = await ensureUniqueSlug(Category, payload.slug || payload.name, id);

  category.set({
    ...payload,
    slug,
    name: sanitizePlainText(payload.name),
    description: sanitizePlainText(payload.description || "")
  });
  await category.save();

  return serializeCategory(category);
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();
};

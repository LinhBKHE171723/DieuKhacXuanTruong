import { Banner } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

const serializeBanner = (banner) => banner.toJSON();

export const getAdminBanners = async (query) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const [count, rows] = await Promise.all([
    Banner.countDocuments({}),
    Banner.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
  ]);

  return {
    items: rows.map(serializeBanner),
    pagination: buildPaginationMeta(count, page, limit)
  };
};

export const getActiveBanners = async () => {
  const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });

  return banners.map(serializeBanner);
};

export const getBannerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }
  return serializeBanner(banner);
};

export const createBanner = async (payload) => {
  const nextSortOrder = payload.sortOrder ?? (await Banner.countDocuments({}));

  const banner = await Banner.create({
    ...payload,
    sortOrder: nextSortOrder
  });

  return serializeBanner(banner);
};

export const updateBanner = async (id, payload) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  banner.set({
    ...payload
  });
  await banner.save();

  return serializeBanner(banner);
};

export const reorderBanners = async (items = []) => {
  if (!items.length) {
    return [];
  }

  await Promise.all(
    items.map((item) =>
      Banner.findByIdAndUpdate(item.id, {
        sortOrder: item.sortOrder
      })
    )
  );

  const banners = await Banner.find({}).sort({ sortOrder: 1, createdAt: -1 });
  return banners.map(serializeBanner);
};

export const deleteBanner = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  await banner.deleteOne();
};

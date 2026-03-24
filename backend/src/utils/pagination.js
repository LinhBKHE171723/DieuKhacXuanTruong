export const getPagination = (page = 1, limit = 12) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 12;
  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  };
};

export const buildPaginationMeta = (count, page, limit) => ({
  totalItems: count,
  totalPages: Math.ceil(count / limit) || 1,
  currentPage: page,
  perPage: limit
});

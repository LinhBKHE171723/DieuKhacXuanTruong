import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { ProductCard } from "../components/product/ProductCard";
import { useProductCategories } from "../hooks/useSiteData";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriesQuery = useProductCategories();
  const loadMoreRef = useRef(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
  };

  // Local search state to prevent focus loss during rapid typing
  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync internal state when URL changes externally
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const updateFilters = (next) => {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.categoryId) params.set("categoryId", next.categoryId);
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  // Debounced search to avoid triggering reload / unmount on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ ...filters, search: searchInput });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const productsQuery = useInfiniteQuery({
    queryKey: ["public-products", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      publicApi.getProducts({ ...filters, page: pageParam, limit: 24 }),
    placeholderData: (previousData) => previousData,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination || pagination.currentPage >= pagination.totalPages) {
        return undefined;
      }
      return pagination.currentPage + 1;
    },
  });

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !productsQuery.hasNextPage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !productsQuery.isFetchingNextPage) {
          productsQuery.fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [
    productsQuery.fetchNextPage,
    productsQuery.hasNextPage,
    productsQuery.isFetchingNextPage,
  ]);

  // Initial full-page loading only when there is zero data
  if (categoriesQuery.isLoading && !categoriesQuery.data) {
    return <LoadingScreen />;
  }

  if (productsQuery.isLoading && !productsQuery.data) {
    return <LoadingScreen />;
  }

  if (productsQuery.isError) {
    return <ErrorState />;
  }

  const pages = productsQuery.data?.pages || [];
  const products = pages.flatMap((page) => page.items || []);
  const categories = categoriesQuery.data?.items || [];
  const totalItems = pages[0]?.pagination?.totalItems || products.length;

  const activeCategory = categories.find((cat) => cat.id === filters.categoryId);

  // Group products by Category/Model when viewing all items without a search query
  const isBrowsingAll = !filters.categoryId && !filters.search;
  const groupedProducts = (() => {
    if (!isBrowsingAll) return null;
    const map = new Map();
    for (const cat of categories) {
      map.set(cat.id, { category: cat, items: [] });
    }
    const unclassified = [];
    for (const prod of products) {
      const catId = prod.categoryId || prod.category?.id;
      if (catId && map.has(catId)) {
        map.get(catId).items.push(prod);
      } else {
        unclassified.push(prod);
      }
    }
    const groups = Array.from(map.values()).filter((g) => g.items.length > 0);
    if (unclassified.length > 0) {
      groups.push({
        category: { id: "other", name: "Sản phẩm khác", slug: "other" },
        items: unclassified
      });
    }
    return groups;
  })();

  return (
    <>
      <Seo
        title="Sản phẩm điêu khắc & hoa văn | Điêu Khắc Xuân Trường"
        description="Danh mục sản phẩm điêu khắc thạch cao, bê tông mỹ thuật, phù điêu, tượng và hoa văn công trình theo từng danh mục và kích thước quy cách."
      />

      <section className="section section--catalog-compact">
        <div className="container container--wide">
          {/* 1. Mobile Category Select (Hiển thị dạng select trên giao diện điện thoại) */}
          <div className="catalog-category-mobile-picker">
            <label htmlFor="catalog-category-mobile-select" className="catalog-mobile-picker__label">
              <span className="picker-icon">🏛️</span>
              <span className="picker-text">Mẫu sản phẩm / Danh mục:</span>
            </label>
            <div className="catalog-mobile-picker__select-wrapper">
              <select
                id="catalog-category-mobile-select"
                className="catalog-mobile-picker__select"
                value={filters.categoryId || ""}
                onChange={(e) => updateFilters({ ...filters, categoryId: e.target.value })}
              >
                <option value="">✨ Tất cả danh mục ({totalItems} quy cách)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.productCount ? `(${cat.productCount} kích thước)` : ""}
                  </option>
                ))}
              </select>
              <span className="picker-arrow" aria-hidden="true">▼</span>
            </div>
          </div>

          {/* Desktop Horizontal Tabs Bar (Ẩn trên mobile <= 768px, hiển thị trên desktop > 768px) */}
          <div className="catalog-category-tabs-bar" role="tablist" aria-label="Danh mục sản phẩm">
            <button
              type="button"
              className={`catalog-cat-tab ${!filters.categoryId ? "active" : ""}`}
              onClick={() => updateFilters({ ...filters, categoryId: "" })}
            >
              ✨ Tất cả danh mục ({totalItems})
            </button>
            {categories.map((cat) => {
              const count = cat.productCount;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`catalog-cat-tab ${filters.categoryId === cat.id ? "active" : ""}`}
                  onClick={() => updateFilters({ ...filters, categoryId: cat.id })}
                >
                  {cat.name} {count ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {/* 2. Streamlined Search & View Mode Toolbar (Responsive, Clean & Lightweight) */}
          <div className="catalog-unified-toolbar">
            {/* Search Input with debounce & clear icon */}
            <div className="catalog-search-inline">
              <span className="search-inline-icon">🔍</span>
              <input
                type="text"
                className="search-inline-input"
                placeholder="Tìm kiếm mẫu sản phẩm hoặc kích thước (vd: Cột vuông, 60x85...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  className="search-inline-clear"
                  onClick={() => {
                    setSearchInput("");
                    updateFilters({ ...filters, search: "" });
                  }}
                  title="Xóa từ khóa"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Switcher (Grid / List) */}
            <div className="catalog-view-controls">
              <div className="view-mode-buttons">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Chế độ Lưới"
                >
                  ▦ Lưới
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Chế độ Danh sách"
                >
                  ☰ Danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Catalog Product List */}
          <div className="catalog-full-content">
            {/* Show search notification bar ONLY when a search keyword is active */}
            {filters.search ? (
              <div className="catalog-search-status-bar">
                <span>
                  Kết quả tìm kiếm cho: <strong>"{filters.search}"</strong> ({products.length} tác phẩm)
                </span>
                <button
                  type="button"
                  className="clear-search-chip"
                  onClick={() => {
                    setSearchInput("");
                    updateFilters({ ...filters, search: "" });
                  }}
                >
                  ✕ Bỏ từ khóa
                </button>
              </div>
            ) : null}

            {productsQuery.isFetching && !productsQuery.isFetchingNextPage ? (
              <p className="list-status" aria-live="polite">
                Đang cập nhật danh sách tác phẩm...
              </p>
            ) : null}

            {/* Product List Render: Grouped by Category OR Filtered Grid */}
            {products.length ? (
              isBrowsingAll && groupedProducts && groupedProducts.length ? (
                /* Grouped by Category View */
                <div className="catalog-grouped-sections">
                  {groupedProducts.map((group) => (
                    <div key={group.category.id} className="catalog-category-block">
                      <div className="catalog-category-block__header">
                        <div className="catalog-category-block__title-area">
                          <h2 className="catalog-category-block__title">
                            {group.category.name}
                          </h2>
                          <span className="catalog-category-block__badge">
                            {group.items.length} kích thước quy cách
                          </span>
                        </div>
                        {group.category.description ? (
                          <p className="catalog-category-block__desc">
                            {group.category.description}
                          </p>
                        ) : null}
                      </div>

                      <div className={viewMode === "list" ? "card-list--catalog" : "card-grid--full-width"}>
                        {group.items.map((product, index) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            delay={index * 0.015}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Filtered or Single-Category List */
                <div className={viewMode === "list" ? "card-list--catalog" : "card-grid--full-width"}>
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      delay={index * 0.015}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                message="Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác ở thanh menu trên."
              />
            )}

            {products.length ? (
              <div className="catalog-more" ref={loadMoreRef}>
                {productsQuery.hasNextPage ? (
                  <>
                    <p>Cuộn tiếp để tải thêm sản phẩm.</p>
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => productsQuery.fetchNextPage()}
                      disabled={productsQuery.isFetchingNextPage}
                    >
                      {productsQuery.isFetchingNextPage
                        ? "Đang tải..."
                        : "Tải thêm tác phẩm"}
                    </button>
                  </>
                ) : (
                  <p className="catalog-end">Đã hiển thị toàn bộ tác phẩm.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { ProductCard } from "../components/product/ProductCard";
import { useProductCategories } from "../hooks/useSiteData";

const MATERIAL_CHIPS = [
  { label: "Tất cả chất liệu", value: "" },
  { label: "Thạch cao", value: "thạch cao" },
  { label: "Bê tông GFRC", value: "bê tông" },
  { label: "Gỗ", value: "gỗ" },
  { label: "Đá", value: "đá" },
  { label: "Phù điêu", value: "phù điêu" },
  { label: "Tượng", value: "tượng" },
  { label: "Mặt tiền / Cột", value: "cột" }
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriesQuery = useProductCategories();
  const loadMoreRef = useRef(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
  };

  const productsQuery = useInfiniteQuery({
    queryKey: ["public-products", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      publicApi.getProducts({ ...filters, page: pageParam, limit: 16 }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination || pagination.currentPage >= pagination.totalPages) {
        return undefined;
      }
      return pagination.currentPage + 1;
    },
  });

  const updateFilters = (next) => {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.categoryId) params.set("categoryId", next.categoryId);
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

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

  if (
    categoriesQuery.isLoading ||
    (productsQuery.isLoading && !productsQuery.data)
  ) {
    return <LoadingScreen />;
  }

  if (productsQuery.isError) {
    return <ErrorState />;
  }

  const pages = productsQuery.data?.pages || [];
  const products = pages.flatMap((page) => page.items || []);
  const categories = categoriesQuery.data?.items || [];
  const totalItems = pages[0]?.pagination?.totalItems || products.length;

  return (
    <>
      <Seo
        title="Sản phẩm điêu khắc & hoa văn | Điêu Khắc Xuân Trường"
        description="Danh mục sản phẩm điêu khắc thạch cao, bê tông mỹ thuật, phù điêu, tượng và hoa văn công trình."
      />

      <section className="section section--catalog-compact">
        <div className="container container--wide">
          {/* Unified Luxury Control Bar: Category Select + Search + Material Chips + View Mode */}
          <div className="catalog-unified-toolbar">
            {/* Category Select Dropdown */}
            <div className="catalog-select-wrapper">
              <span className="select-icon">📁</span>
              <select
                className="catalog-category-select"
                value={filters.categoryId}
                onChange={(e) => updateFilters({ ...filters, categoryId: e.target.value })}
              >
                <option value="">✨ Tất cả danh mục ({totalItems} tác phẩm)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Search Input */}
            <div className="catalog-search-inline">
              <span className="search-inline-icon">🔍</span>
              <input
                type="text"
                className="search-inline-input"
                placeholder="Nhập tên sản phẩm cần tìm..."
                value={filters.search}
                onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <button
                  type="button"
                  className="search-inline-clear"
                  onClick={() => updateFilters({ ...filters, search: "" })}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Material Filter Chips */}
            <div className="catalog-material-chips">
              <span className="chips-label">Chất liệu:</span>
              <div className="chips-group">
                {MATERIAL_CHIPS.map((chip) => {
                  const isActive = (filters.search || "").toLowerCase() === chip.value.toLowerCase();
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      className={`material-chip ${isActive ? "active" : ""}`}
                      onClick={() => updateFilters({ ...filters, search: chip.value })}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="catalog-view-controls">
              <div className="view-mode-buttons">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Chế độ Lưới 4 cột"
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
            {filters.search && (
              <div className="catalog-search-status-bar">
                <span>Kết quả tìm kiếm cho: <strong>"{filters.search}"</strong> ({products.length} tác phẩm)</span>
                <button
                  type="button"
                  className="clear-search-chip"
                  onClick={() => updateFilters({ ...filters, search: "" })}
                >
                  ✕ Xóa từ khóa
                </button>
              </div>
            )}

            {productsQuery.isFetching && !productsQuery.isFetchingNextPage ? (
              <p className="list-status" aria-live="polite">
                Đang cập nhật danh sách tác phẩm...
              </p>
            ) : null}

            {products.length ? (
              <div className={viewMode === "list" ? "card-list--catalog" : "card-grid--full-width"}>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={index * 0.025}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                message="Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác ở menu trên."
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

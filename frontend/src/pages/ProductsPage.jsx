import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { PageHero } from "../components/common/PageHero";
import { Seo } from "../components/common/Seo";
import { ProductCard } from "../components/product/ProductCard";
import { ProductFilters } from "../components/product/ProductFilters";
import { useProductCategories } from "../hooks/useSiteData";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriesQuery = useProductCategories();
  const loadMoreRef = useRef(null);
  const filters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
  };

  const productsQuery = useInfiniteQuery({
    queryKey: ["public-products", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      publicApi.getProducts({ ...filters, page: pageParam, limit: 12 }),
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
  const totalItems = pages[0]?.pagination?.totalItems || products.length;

  return (
    <>
      <Seo
        title="Sản phẩm điêu khắc và hoa văn"
        description="Danh sách sản phẩm điêu khắc thạch cao, bê tông mỹ thuật, hoa văn công trình và cấu kiện đúc sẵn."
      />
      <PageHero
        className="page-hero--catalog"
        eyebrow="Sản phẩm"
        title="Sản phẩm và chi tiết kiến trúc"
        description="Tìm nhanh mẫu phù hợp theo danh mục và phong cách."
        imageUrl="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section section--catalog-mobile">
        <div className="container container--wide catalog-layout">
          <aside className="catalog-sidebar">
            <div className="catalog-sidebar__intro">
              <span className="section-title__eyebrow">Bộ lọc</span>
              <h2>Tìm nhanh mẫu phù hợp</h2>
              <p>
                Lọc theo tên và danh mục để thu gọn danh sách ngay khi bạn đang
                xem.
              </p>
            </div>

            <ProductFilters
              categories={categoriesQuery.data?.items || []}
              filters={filters}
              onChange={updateFilters}
            />
          </aside>

          <div className="catalog-content">
            <div className="catalog-content__head">
              <div>
                <span className="section-title__eyebrow">Danh sách</span>
              </div>
              {productsQuery.isFetching && !productsQuery.isFetchingNextPage ? (
                <p className="list-status" aria-live="polite">
                  Đang cập nhật danh sách sản phẩm...
                </p>
              ) : null}
            </div>

            {products.length ? (
              <div className="card-grid card-grid--catalog">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={index * 0.04}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                message="Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác."
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
                        ? "Đang tải thêm..."
                        : "Tải thêm sản phẩm"}
                    </button>
                  </>
                ) : (
                  <p className="catalog-end">Đã hiển thị toàn bộ sản phẩm.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { PageHero } from "../components/common/PageHero";
import { Seo } from "../components/common/Seo";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProductFilters } from "../components/product/ProductFilters";

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    page: searchParams.get("page") || "1"
  };

  const categoriesQuery = useQuery({
    queryKey: ["project-categories"],
    queryFn: () => publicApi.getCategories({ type: "PROJECT", limit: "all" })
  });

  const projectsQuery = useQuery({
    queryKey: ["public-projects", filters],
    queryFn: () => publicApi.getProjects({ ...filters, limit: 9 }),
    placeholderData: keepPreviousData
  });

  const updateFilters = (next) => {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.categoryId) params.set("categoryId", next.categoryId);
    params.set("page", "1");
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  if (categoriesQuery.isLoading || (projectsQuery.isLoading && !projectsQuery.data)) {
    return <LoadingScreen />;
  }

  if (projectsQuery.isError) {
    return <ErrorState />;
  }

  return (
    <>
      <Seo title="Công trình và dự án đã hoàn thiện" description="Tổng hợp các công trình điêu khắc, hoa văn kiến trúc và bê tông mỹ thuật đã thi công." />
      <PageHero
        className="page-hero--catalog"
        eyebrow="Công trình"
        title="Công trình đã hoàn thiện"
        description="Hình ảnh thực tế và phạm vi triển khai của từng dự án."
        imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="section section--catalog-mobile">
        <div className="container">
          <ProductFilters
            categories={categoriesQuery.data?.items || []}
            filters={filters}
            onChange={updateFilters}
            searchLabel="Tìm công trình"
          />

          {projectsQuery.isFetching ? (
            <p className="list-status" aria-live="polite">
              Đang cập nhật danh sách công trình...
            </p>
          ) : null}

          {projectsQuery.data.items.length ? (
            <div className="card-grid">
              {projectsQuery.data.items.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 0.05} />
              ))}
            </div>
          ) : (
            <EmptyState title="Không tìm thấy công trình" message="Hãy thử bộ lọc khác để xem các dự án đã hoàn thiện." />
          )}
        </div>
      </section>
    </>
  );
}

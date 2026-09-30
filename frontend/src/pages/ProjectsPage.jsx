import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../api/publicApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { ProjectCard } from "../components/project/ProjectCard";

export function ProjectsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-projects"],
    queryFn: () => publicApi.getProjects({ limit: 12 })
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  const projects = data.items || [];

  return (
    <>
      <Seo
        title="Công trình và dự án đã hoàn thiện"
        description="Tổng hợp các công trình điêu khắc, hoa văn kiến trúc và bê tông mỹ thuật đã thi công."
      />
      <section className="section projects-page-section">
        <div className="container">
          {/* Header gọn gàng, tinh tế, vừa vặn tầm mắt */}
          <div className="projects-compact-header">
            <span className="projects-compact-header__eyebrow">Công trình</span>
            <h1 className="projects-compact-header__title">Công trình đã hoàn thiện</h1>
            <p className="projects-compact-header__desc">
              Hình ảnh thực tế và phạm vi triển khai của từng dự án.
            </p>
          </div>

          {/* Danh sách công trình tiêu biểu trực tiếp, không bộ lọc tìm kiếm */}
          {projects.length ? (
            <div className="card-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 0.05} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Đang cập nhật công trình"
              message="Các dự án và công trình hoàn thiện tiêu biểu sẽ sớm được cập nhật."
            />
          )}
        </div>
      </section>
    </>
  );
}

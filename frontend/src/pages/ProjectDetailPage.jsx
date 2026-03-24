import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProjectGallery } from "../components/project/ProjectGallery";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-detail", slug],
    queryFn: () => publicApi.getProjectDetail(slug)
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  return (
    <>
      <Seo title={data.metaTitle || data.name} description={data.metaDescription || data.shortDescription} />
      <section className="section detail-section">
        <div className="container detail-grid">
          <ProjectGallery images={data.images} title={data.name} />
          <div className="detail-content">
            <span className="detail-label">{data.category?.name || "Công trình"}</span>
            <h1>{data.name}</h1>
            <p className="detail-summary">{data.shortDescription}</p>
            <div className="detail-meta">
              <div>
                <strong>Địa điểm</strong>
                <span>{data.location || "Đang cập nhật"}</span>
              </div>
              <div>
                <strong>Năm thực hiện</strong>
                <span>{data.year || "Đang cập nhật"}</span>
              </div>
              <div>
                <strong>Hạng mục</strong>
                <span>{data.scope || "Thi công theo gói"}</span>
              </div>
            </div>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
        </div>
      </section>

      {data.relatedProjects?.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="section-title">
              <span className="section-title__eyebrow">Liên quan</span>
              <h2>Công trình khác</h2>
            </div>
            <div className="card-grid">
              {data.relatedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 0.05} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

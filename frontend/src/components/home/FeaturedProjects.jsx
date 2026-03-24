import { Link } from "react-router-dom";
import { ProjectCard } from "../project/ProjectCard";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturedProjects({ projects = [] }) {
  if (!projects.length) {
    return null;
  }

  return (
    <section className="section featured-showcase featured-showcase--projects">
      <div className="container">
        <SectionTitle
          eyebrow="Công trình"
          title="Một số dự án đã hoàn thiện"
          description="Hình ảnh thực tế giúp khách hàng xem nhanh quy mô, chất liệu và mức độ hoàn thiện."
          size="compact"
        />

        <div className="card-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 0.08} />
          ))}
        </div>

        <div className="section-actions section-actions--showcase">
          <Link className="button button--primary" to="/cong-trinh">
            Xem tất cả công trình
          </Link>
        </div>
      </div>
    </section>
  );
}

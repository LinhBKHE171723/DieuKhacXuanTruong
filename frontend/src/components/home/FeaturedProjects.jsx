import { Link } from "react-router-dom";
import { ProjectCard } from "../project/ProjectCard";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturedProjects({ projects = [] }) {
  if (!projects.length) return null;

  return (
    <section className="section featured-projects-luxury">
      <div className="container container--wide">
        <SectionTitle
          eyebrow="Công Trình Thực Tế"
          title="Dự Án Thi Công Điêu Khắc & Hoa Văn Đã Hoàn Thiện"
          description="Hình ảnh thực tế thi công phù điêu, cột cổng, vòm cửa và linh vật tại các biệt thự, đền thờ và công trình công cộng."
          size="compact"
          align="center"
        />

        <div className="card-grid--projects-luxury">
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 0.06} />
          ))}
        </div>

        <div className="section-actions section-actions--showcase" style={{ marginTop: "36px" }}>
          <Link className="button button--ghost" to="/cong-trinh">
            🏛️ Xem Tất Cả Công Trình →
          </Link>
        </div>
      </div>
    </section>
  );
}

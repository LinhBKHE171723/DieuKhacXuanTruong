import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";

export function ProjectCard({ project, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="product-card project-card">
        <Link to={`/cong-trinh/${project.slug}`} className="product-card__image" aria-label={`Xem dự án ${project.name}`}>
          <img src={project.thumbnail || project.images?.[0]?.url} alt={project.name} loading="lazy" decoding="async" />
        </Link>
        <div className="product-card__body">
          <span className="product-card__category">{project.location || project.category?.name || "Công trình"}</span>
          <h3>
            <Link to={`/cong-trinh/${project.slug}`} className="product-card__title-link">
              {project.name}
            </Link>
          </h3>
          <p>{project.shortDescription}</p>
          <Link className="button button--ghost" to={`/cong-trinh/${project.slug}`}>
            Xem công trình →
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

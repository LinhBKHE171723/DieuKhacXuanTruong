import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";

export function ProjectCard({ project, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="product-card project-card">
        <div className="product-card__image">
          <img src={project.thumbnail || project.images?.[0]?.url} alt={project.name} loading="lazy" decoding="async" />
        </div>
        <div className="product-card__body">
          <span>{project.location || project.category?.name}</span>
          <h3>{project.name}</h3>
          <p>{project.shortDescription}</p>
          <Link className="button button--ghost" to={`/cong-trinh/${project.slug}`}>
            Xem công trình
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

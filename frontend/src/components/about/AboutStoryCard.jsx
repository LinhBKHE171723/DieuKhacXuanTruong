import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";

export function AboutStoryCard({ story, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="about-story-card">
        <Link className="about-story-card__media" to={`/gioi-thieu/${story.slug}`}>
          <img src={story.imageUrl} alt={story.imageAlt} loading="lazy" decoding="async" />
        </Link>
        <div className="about-story-card__body">
          {story.tag ? <span className="section-title__eyebrow">{story.tag}</span> : null}
          <h3>{story.title}</h3>
          {story.summary ? <p>{story.summary}</p> : null}
          <Link className="button button--primary" to={`/gioi-thieu/${story.slug}`}>
            Xem chi tiết
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

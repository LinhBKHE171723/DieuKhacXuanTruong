import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, description, imageUrl, className = "" }) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div className="page-hero__media">
        <img src={imageUrl} alt={title} loading="eager" />
      </div>
      <div className="page-hero__overlay" />
      <div className="container container--wide page-hero__content">
        <Reveal>
          <span className="page-hero__eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </Reveal>
      </div>
    </section>
  );
}

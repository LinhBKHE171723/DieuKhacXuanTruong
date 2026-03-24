import { Reveal } from "./Reveal";

export function SectionTitle({ eyebrow, title, description, align = "left", size = "default", className = "" }) {
  return (
    <Reveal>
      <div className={`section-title section-title--${align} section-title--${size} ${className}`.trim()}>
        {eyebrow ? <span className="section-title__eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </Reveal>
  );
}

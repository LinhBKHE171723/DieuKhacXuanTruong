import { Reveal } from "../common/Reveal";

export function IntroSection({ sections = {} }) {
  const stats = (sections.stats || [])
    .filter((item) => item?.label || item?.value)
    .slice(0, 3);

  return (
    <section className="section intro-section">
      <div className={`container intro-section__frame${stats.length ? "" : " intro-section__frame--single"}`}>
        <Reveal>
          <div className="intro-section__copy">
            {sections.introBadge ? <span className="section-title__eyebrow">{sections.introBadge}</span> : null}
            {sections.introTitle ? <h2>{sections.introTitle}</h2> : null}
            {sections.introDescription ? <p>{sections.introDescription}</p> : null}
          </div>
        </Reveal>

        {stats.length ? (
          <div className="intro-section__stats">
            {stats.map((item, index) => (
              <Reveal key={`${item.label || "stat"}-${index}`} delay={index * 0.1} className="fill-height">
                <div className="stat-card stat-card--royal">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

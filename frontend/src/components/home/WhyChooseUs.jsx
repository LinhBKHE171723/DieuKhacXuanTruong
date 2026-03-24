import { Reveal } from "../common/Reveal";
import { SectionTitle } from "../common/SectionTitle";

export function WhyChooseUs({ sections = {} }) {
  const reasons = (sections.reasons || [])
    .filter((item) => item?.title || item?.description)
    .slice(0, 4);

  if (!reasons.length) {
    return null;
  }

  return (
    <section className="section section--accent why-choose-section">
      <div className="container">
        <SectionTitle
          eyebrow="Lý do tin dùng"
          title={sections.reasonTitle || "Lý do khách hàng lựa chọn chúng tôi"}
          description="Các điểm quan trọng được trình bày ngắn gọn để người xem nắm nhanh lợi thế của xưởng."
          size="compact"
        />

        <div className="why-choose__layout">
          <div className="reason-grid reason-grid--balanced">
            {reasons.map((item, index) => (
              <Reveal key={`${item.title || "reason"}-${index}`} delay={index * 0.08} className="fill-height">
                <div className="reason-card reason-card--balanced">
                  <span className="reason-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

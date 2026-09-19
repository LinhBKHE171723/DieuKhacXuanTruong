import { motion } from "framer-motion";
import { Reveal } from "../common/Reveal";
import { SectionTitle } from "../common/SectionTitle";

const REASON_ICONS = ["📐", "🛠️", "💎", "🏛️"];

export function WhyChooseUs({ sections = {} }) {
  const reasons = (sections.reasons || [])
    .filter((item) => item?.title || item?.description)
    .slice(0, 4);

  if (!reasons.length) return null;

  return (
    <section className="section why-choose-section-luxury">
      <div className="container">
        <SectionTitle
          eyebrow="Lợi Thế Nổi Bật"
          title={sections.reasonTitle || "Tại Sao Chủ Đầu Tư Lựa Chọn Điêu Khắc Xuân Trường?"}
          description="Sự kết hợp giữa tay nghề nghệ nhân gia truyền, công nghệ dựng khuôn đúc hiện đại và cam kết chất lượng dài lâu."
          size="compact"
          align="center"
        />

        <div className="why-choose-luxury-grid">
          {reasons.map((item, index) => (
            <Reveal key={`${item.title || "reason"}-${index}`} delay={index * 0.08}>
              <motion.div
                className="why-choose-card-luxury"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <div className="why-choose-card-luxury__head">
                  <span className="why-choose-icon">{REASON_ICONS[index % REASON_ICONS.length]}</span>
                  <span className="why-choose-num">0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

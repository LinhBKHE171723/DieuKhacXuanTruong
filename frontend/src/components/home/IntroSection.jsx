import { motion } from "framer-motion";
import { Reveal } from "../common/Reveal";

export function IntroSection({ sections = {} }) {
  const stats = (sections.stats || [])
    .filter((item) => item?.label || item?.value)
    .slice(0, 3);

  const badge = sections.introBadge || "Nghệ thuật Tạo tác & Chế tác Kiến trúc";
  const title = sections.introTitle || "Điêu Khắc Xuân Trường - Tôn Vinh Tinh Hoa Mỹ Thuật & Kiến Trúc";
  const description = sections.introDescription || "Chúng tôi chuyên chế tác các tác phẩm điêu khắc gỗ, đá, thạch cao, phù điêu nghệ thuật, linh vật và cấu kiện bê tông đúc sẵn GFRC cho biệt thự, nhà ở và các công trình tâm linh cao cấp.";

  return (
    <section className="section intro-section-luxury">
      <div className="container">
        <div className="intro-luxury-frame">
          <Reveal>
            <div className="intro-luxury-copy">
              <span className="gold-eyebrow-chip">✨ {badge}</span>
              <h2 className="intro-luxury-title">{title}</h2>
              <p className="intro-luxury-desc">{description}</p>
              
              <div className="intro-luxury-highlights">
                <div className="highlight-pill">
                  <span className="icon">🏛️</span>
                  <div>
                    <strong>Tân Cổ Điển & Cổ Truyền</strong>
                    <small>Đúng tỷ lệ & phong cách kiến trúc</small>
                  </div>
                </div>
                <div className="highlight-pill">
                  <span className="icon">🎨</span>
                  <div>
                    <strong>Nghệ Nhân Tay Nghề Cao</strong>
                    <small>Đường nét chạm khắc sắc nét</small>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {stats.length > 0 && (
            <div className="intro-luxury-stats-grid">
              {stats.map((item, index) => (
                <Reveal key={`${item.label || "stat"}-${index}`} delay={index * 0.1}>
                  <motion.div
                    className="stat-card-luxury"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="stat-card-luxury__value">{item.value}</span>
                    <span className="stat-card-luxury__label">{item.label}</span>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

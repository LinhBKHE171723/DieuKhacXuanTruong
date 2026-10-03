import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "../common/Reveal";
import { SectionTitle } from "../common/SectionTitle";

export function CategoryHighlights({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="section category-highlights-section">
      <div className="container">
        <SectionTitle
          eyebrow="Danh mục sản phẩm"
          title="Hoa văn, phù điêu và tượng trang trí"
          description="Lựa chọn nhóm sản phẩm phù hợp với kiến trúc và nhu cầu trang trí của công trình."
          size="compact"
          align="center"
        />

        <div className="category-luxury-grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.06} className="category-luxury-grid__reveal">
              <motion.div
                className="category-luxury-grid__motion"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  className="category-card-luxury"
                  to={`/san-pham?categoryId=${category.id}`}
                >
                  <div className="category-card-luxury__badge">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="category-card-luxury__content">
                    <span className="category-card-luxury__tag">
                      {category.productCount ? `${category.productCount} Tác phẩm` : "Điêu khắc cao cấp"}
                    </span>
                    <h3>{category.name}</h3>
                    <p className="category-card-luxury__desc">{category.description || "Chế tác tinh xảo, đường nét chuẩn tỷ lệ kiến trúc."}</p>
                    <span className="category-card-luxury__link">Khám phá ngay →</span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

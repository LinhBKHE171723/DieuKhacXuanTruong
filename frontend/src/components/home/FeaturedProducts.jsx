import { Link } from "react-router-dom";
import { ProductCard } from "../product/ProductCard";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="section section--soft featured-showcase-luxury">
      <div className="container container--wide">
        <SectionTitle
          eyebrow="Tác phẩm Nổi bật"
          title="Bộ Sưu Tập Tác Phẩm Điêu Khắc Tiêu Biểu"
          description="Những thiết kế hoa văn, tượng nghệ thuật và phù điêu tân cổ điển được lựa chọn nhiều nhất cho biệt thự và công trình sang trọng."
          size="compact"
          align="center"
        />

        <div className="card-grid--full-width">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.05} />
          ))}
        </div>

        <div className="section-actions section-actions--showcase" style={{ marginTop: "40px" }}>
          <Link className="button button--primary-gold-full" to="/san-pham" style={{ maxWidth: "320px", margin: "0 auto", textAlign: "center" }}>
            ✨ Khám Phá Toàn Bộ Tác Phẩm →
          </Link>
        </div>
      </div>
    </section>
  );
}

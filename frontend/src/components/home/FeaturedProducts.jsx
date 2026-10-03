import { Link } from "react-router-dom";
import { ProductCard } from "../product/ProductCard";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="section section--soft featured-showcase-luxury">
      <div className="container container--wide">
        <SectionTitle
          eyebrow="Sản phẩm nổi bật"
          title="Mẫu điêu khắc và hoa văn tiêu biểu"
          description="Tham khảo các mẫu hoa văn, phù điêu và tượng trang trí cho công trình của quý khách."
          size="compact"
          align="center"
        />

        <div className="card-grid--full-width">
          {products.slice(0, 12).map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.05} />
          ))}
        </div>

        <div className="section-actions section-actions--showcase" style={{ marginTop: "40px" }}>
          <Link className="button button--primary-gold-full" to="/san-pham" style={{ maxWidth: "320px", margin: "0 auto", textAlign: "center" }}>
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    </section>
  );
}

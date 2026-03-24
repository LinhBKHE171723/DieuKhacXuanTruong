import { Link } from "react-router-dom";
import { ProductCard } from "../product/ProductCard";
import { SectionTitle } from "../common/SectionTitle";

export function FeaturedProducts({ products = [] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="section section--soft featured-showcase">
      <div className="container">
        <SectionTitle
          eyebrow="Sản phẩm nổi bật"
          title="Các mẫu được lựa chọn nhiều"
          description="Những thiết kế nổi bật, dễ ứng dụng cho nhà ở, biệt thự và công trình điểm nhấn."
          size="compact"
        />

        <div className="card-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.08} />
          ))}
        </div>

        <div className="section-actions section-actions--showcase">
          <Link className="button button--primary" to="/san-pham">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}

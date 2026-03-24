import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";
import { SectionTitle } from "../common/SectionTitle";

export function CategoryHighlights({ categories = [] }) {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Danh mục"
          title="Những nhóm sản phẩm được quan tâm nhiều"
          description="Hệ danh mục được tổ chức rõ ràng để khách hàng dễ dàng tìm nhóm chi tiết phù hợp công trình."
        />

        <div className="category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.08}>
              <Link className="category-card" to={`/san-pham?categoryId=${category.id}`}>
                <span className="category-card__index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

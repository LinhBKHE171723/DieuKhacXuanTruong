import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";

export function ProductCard({ product, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <article className="product-card">
        <div className="product-card__image">
          <img src={product.thumbnail || product.images?.[0]?.url} alt={product.name} loading="lazy" decoding="async" />
        </div>
        <div className="product-card__body">
          <span>{product.category?.name}</span>
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>
          <Link className="button button--ghost" to={`/san-pham/${product.slug}`}>
            Xem chi tiết
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

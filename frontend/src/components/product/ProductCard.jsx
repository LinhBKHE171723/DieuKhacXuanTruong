import { Link } from "react-router-dom";
import { Reveal } from "../common/Reveal";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

export function ProductCard({ product, delay = 0, viewMode = "grid" }) {
  const imageUrl = product.thumbnail || product.images?.[0]?.url || DEFAULT_PLACEHOLDER;
  const isList = viewMode === "list";

  return (
    <Reveal delay={delay} className="product-card-reveal-wrapper">
      <article className={isList ? "product-card-list-item" : "product-card"}>
        <Link
          className={isList ? "product-card-list-thumb" : "product-card__image product-card__image-link"}
          to={`/san-pham/${product.slug}`}
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              if (event.currentTarget.src !== DEFAULT_PLACEHOLDER) {
                event.currentTarget.src = DEFAULT_PLACEHOLDER;
              }
            }}
          />
        </Link>
        <div className={isList ? "product-card-list-content" : "product-card__body"}>
          <h3 className="product-card__spec-name">
            <Link className="product-card__title-link" to={`/san-pham/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          {product.shortDescription && (
            <p className={isList ? "product-card-list-desc" : "product-card__desc"}>
              {product.shortDescription}
            </p>
          )}
        </div>
      </article>
    </Reveal>
  );
}

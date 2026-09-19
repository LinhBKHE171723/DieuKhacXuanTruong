import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "../common/Reveal";
import { Art3DViewerModal } from "../common/Art3DViewerModal";
import { ProductQuickViewModal } from "./ProductQuickViewModal";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

export function ProductCard({ product, delay = 0, viewMode = "grid" }) {
  const [show3DModal, setShow3DModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const imageUrl = product.thumbnail || product.images?.[0]?.url || DEFAULT_PLACEHOLDER;

  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

  if (viewMode === "list") {
    return (
      <Reveal delay={delay} className="product-card-reveal-wrapper">
        <article className="product-card-list-item">
          <div className="product-card-list-thumb">
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
            <button
              type="button"
              className="list-3d-badge"
              onClick={() => setShow3DModal(true)}
            >
              ✨ Xoay 3D
            </button>
          </div>

          <div className="product-card-list-content">
            <div className="product-card-list-header">
              <span className="product-card__category">
                {product.category?.name || "Điêu khắc"}
              </span>
              <h3>{product.name}</h3>
            </div>
            <p className="product-card-list-desc">{product.shortDescription}</p>

            <div className="product-card-list-meta">
              <span>🧱 Chất liệu: <strong>{product.material || "Chất liệu cao cấp"}</strong></span>
              <span>📐 Kích thước: <strong>{product.dimensions || "Theo yêu cầu"}</strong></span>
            </div>

            <div className="product-card-list-actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setShowQuickView(true)}
              >
                👁️ Xem nhanh
              </button>
              <button
                type="button"
                className="button button--primary-gold-outline"
                onClick={() => setShow3DModal(true)}
              >
                ✨ Xoay 3D
              </button>
              <Link className="button button--primary" to={`/san-pham/${product.slug}`}>
                Chi tiết →
              </Link>
            </div>
          </div>

          <ProductQuickViewModal
            product={product}
            open={showQuickView}
            onClose={() => setShowQuickView(false)}
          />
          <Art3DViewerModal
            open={show3DModal}
            onClose={() => setShow3DModal(false)}
            imageUrl={imageUrl}
            title={product.name}
          />
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delay={delay} className="product-card-reveal-wrapper">
      <motion.article
        className="product-card product-card--3d-hover"
        whileHover={{
          scale: 1.025,
          rotateX: 2,
          rotateY: -2,
          boxShadow: "0 20px 45px rgba(197, 155, 39, 0.22)"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="product-card__image">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
          <div className="product-card__3d-overlay">
            <button
              type="button"
              className="product-card__3d-btn"
              onClick={() => setShowQuickView(true)}
            >
              👁️ Xem nhanh
            </button>
            <button
              type="button"
              className="product-card__3d-btn gold"
              onClick={() => setShow3DModal(true)}
            >
              ✨ Soi 3D
            </button>
          </div>
        </div>

        <div className="product-card__body">
          {product.category?.name && (
            <span className="product-card__category">{product.category.name}</span>
          )}
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>

          <div className="product-card__footer-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setShowQuickView(true)}
            >
              Xem nhanh
            </button>
            <button
              type="button"
              className="button button--primary-gold-outline"
              onClick={() => setShow3DModal(true)}
            >
              Xoay 3D
            </button>
          </div>
        </div>
      </motion.article>

      <ProductQuickViewModal
        product={product}
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
      <Art3DViewerModal
        open={show3DModal}
        onClose={() => setShow3DModal(false)}
        imageUrl={imageUrl}
        title={product.name}
      />
    </Reveal>
  );
}

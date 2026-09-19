import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Art3DViewerModal } from "../common/Art3DViewerModal";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

export function ProductQuickViewModal({ product, open, onClose }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [show3DModal, setShow3DModal] = useState(false);

  if (!open || !product || typeof document === "undefined") return null;

  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

  const images = product.images?.length
    ? product.images
    : [{ url: product.thumbnail || product.imageUrl || DEFAULT_PLACEHOLDER, altText: product.name }];

  const activeImage = images[activeImgIndex] || images[0] || { url: DEFAULT_PLACEHOLDER, altText: product.name };

  return createPortal(
    <div className="quickview-modal-overlay" onClick={onClose}>
      <div
        className="quickview-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="quickview-close-btn"
          onClick={onClose}
          aria-label="Đóng cửa sổ xem nhanh"
          title="Đóng"
        >
          ✕
        </button>

        <div className="quickview-grid">
          {/* Gallery Section */}
          <div className="quickview-gallery">
            <div className="quickview-main-image-box">
              <img
                src={activeImage?.url || DEFAULT_PLACEHOLDER}
                alt={activeImage?.altText || product.name}
                className="quickview-main-image"
                onError={handleImageError}
              />
              <button
                type="button"
                className="quickview-3d-trigger-badge"
                onClick={() => setShow3DModal(true)}
              >
                ✨ Xem 3D Đa Chiều
              </button>
            </div>

            {images.length > 1 && (
              <div className="quickview-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    className={`quickview-thumb-btn ${idx === activeImgIndex ? "active" : ""}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img
                      src={img.url || DEFAULT_PLACEHOLDER}
                      alt={img.altText || ""}
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="quickview-info">
            <span className="quickview-category-badge">
              {product.category?.name || "Điêu khắc nghệ thuật"}
            </span>
            <h2 className="quickview-title">{product.name}</h2>
            <p className="quickview-short-desc">{product.shortDescription}</p>

            <div className="quickview-specs-box">
              <div className="quickview-spec-item">
                <span className="spec-label">🧱 Chất liệu:</span>
                <strong className="spec-value">{product.material || "Gỗ / Đá / Thạch cao / Bê tông mỹ thuật"}</strong>
              </div>
              <div className="quickview-spec-item">
                <span className="spec-label">📐 Kích thước:</span>
                <strong className="spec-value">{product.dimensions || "Theo thiết kế công trình"}</strong>
              </div>
              {product.tags?.length > 0 && (
                <div className="quickview-spec-item">
                  <span className="spec-label">🏷️ Thẻ từ khóa:</span>
                  <div className="spec-tags">
                    {product.tags.map((t) => (
                      <span key={t} className="spec-tag-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="quickview-actions">
              <button
                type="button"
                className="button button--primary-gold-full"
                onClick={() => setShow3DModal(true)}
              >
                ✨ Soi tác phẩm góc xoay 3D
              </button>

              <div className="quickview-contact-group">
                <a
                  href="https://zalo.me/0909888668"
                  target="_blank"
                  rel="noreferrer"
                  className="quickview-contact-btn zalo"
                >
                  💬 Nhắn Zalo tư vấn
                </a>
                <a
                  href="tel:0909888668"
                  className="quickview-contact-btn hotline"
                >
                  📞 Gọi Hotline báo giá
                </a>
              </div>

              <Link
                to={`/san-pham/${product.slug}`}
                className="quickview-detail-link"
                onClick={onClose}
              >
                Xem chi tiết mô tả đầy đủ →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Art3DViewerModal
        open={show3DModal}
        onClose={() => setShow3DModal(false)}
        imageUrl={activeImage?.url}
        title={product.name}
      />
    </div>,
    document.body
  );
}

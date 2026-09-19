import { useEffect, useMemo, useState } from "react";
import { ImageLightbox } from "../common/ImageLightbox";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

export function ProductGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [images]);

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || { url: DEFAULT_PLACEHOLDER, altText: title },
    [activeIndex, images, title],
  );

  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

  return (
    <>
      <div className="detail-gallery">
        <div className="detail-gallery__main">
          <button
            type="button"
            className="detail-gallery__main-button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Xem ảnh lớn của ${title}`}
          >
            <img
              src={activeImage.url || DEFAULT_PLACEHOLDER}
              alt={activeImage.altText || title}
              loading="eager"
              decoding="async"
              onError={handleImageError}
            />
            <span className="detail-gallery__zoom-chip">Chạm để phóng to</span>
          </button>
        </div>
        <div className="detail-gallery__thumbs-shell">
          {images.length > 1 ? (
            <p className="detail-gallery__thumbs-hint">Vuốt ngang để xem thêm ảnh</p>
          ) : null}
          <div className="detail-gallery__thumbs">
            {images.map((image, index) => (
              <button
                key={image.id || image.url || index}
                type="button"
                className={activeIndex === index ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image.url || DEFAULT_PLACEHOLDER}
                  alt={image.altText || title}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <ImageLightbox
        images={images}
        activeIndex={activeIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelect={setActiveIndex}
        title={title}
      />
    </>
  );
}

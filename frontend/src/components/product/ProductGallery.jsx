import { useEffect, useMemo, useState } from "react";
import { ImageLightbox } from "../common/ImageLightbox";

export function ProductGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [images]);

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || null,
    [activeIndex, images],
  );

  if (!activeImage) {
    return null;
  }

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
              src={activeImage.url}
              alt={activeImage.altText || title}
              loading="eager"
              decoding="async"
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
                key={image.id || image.url}
                type="button"
                className={activeIndex === index ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image.url}
                  alt={image.altText || title}
                  loading="lazy"
                  decoding="async"
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

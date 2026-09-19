import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const clampZoom = (value) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));

export function ImageLightbox({
  images = [],
  activeIndex = 0,
  open = false,
  onClose,
  onSelect,
  title,
}) {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || null,
    [activeIndex, images],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        onSelect?.((activeIndex + 1) % images.length);
        return;
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        onSelect?.((activeIndex - 1 + images.length) % images.length);
        return;
      }

      if (event.key === "+" || event.key === "=") {
        setZoom((current) => clampZoom(current + ZOOM_STEP));
      }

      if (event.key === "-") {
        setZoom((current) => clampZoom(current - ZOOM_STEP));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onClose, onSelect, open]);

  useEffect(() => {
    if (open) {
      setZoom(MIN_ZOOM);
    }
  }, [activeIndex, open]);

  if (!open || !activeImage || typeof document === "undefined") {
    return null;
  }

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setZoom((current) => clampZoom(current + delta));
  };

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="image-lightbox__dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="image-lightbox__toolbar">
          <div className="image-lightbox__toolbar-group">
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="image-lightbox__button"
                  onClick={() =>
                    onSelect?.(
                      (activeIndex - 1 + images.length) % images.length,
                    )
                  }
                >
                  Ảnh trước
                </button>
                <button
                  type="button"
                  className="image-lightbox__button"
                  onClick={() => onSelect?.((activeIndex + 1) % images.length)}
                >
                  Ảnh sau
                </button>
              </>
            ) : null}
          </div>

          <div className="image-lightbox__toolbar-group">
            <button
              type="button"
              className="image-lightbox__button"
              onClick={() =>
                setZoom((current) => clampZoom(current - ZOOM_STEP))
              }
              disabled={zoom <= MIN_ZOOM}
            >
              Thu nhỏ
            </button>
            <button
              type="button"
              className="image-lightbox__button"
              onClick={() => setZoom(MIN_ZOOM)}
              disabled={zoom === MIN_ZOOM}
            >
              Mặc định
            </button>
            <button
              type="button"
              className="image-lightbox__button image-lightbox__button--primary"
              onClick={() =>
                setZoom((current) => clampZoom(current + ZOOM_STEP))
              }
              disabled={zoom >= MAX_ZOOM}
            >
              Phóng to
            </button>
            <button
              type="button"
              className="image-lightbox__button"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="image-lightbox__stage" onWheel={handleWheel}>
          <img
            src={activeImage.url || DEFAULT_PLACEHOLDER}
            alt={activeImage.altText || title}
            style={{ transform: `scale(${zoom})` }}
            loading="eager"
            decoding="async"
            onError={(e) => { e.currentTarget.src = DEFAULT_PLACEHOLDER; }}
          />
        </div>

        <div className="image-lightbox__footer">
          <p>{activeImage.altText || title}</p>
          <span>
            {activeIndex + 1}/{images.length} • {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

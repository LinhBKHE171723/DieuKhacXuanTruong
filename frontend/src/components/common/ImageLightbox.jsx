import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Cpath d='M160 110 L240 110 L240 190 L160 190 Z' stroke='%23c59b27' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='150' r='20' fill='%23c59b27' opacity='0.3'/%3E%3Ctext x='200' y='220' font-family='serif' font-size='14' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4.5;
const ZOOM_STEP = 0.5;

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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const touchStateRef = useRef({
    type: null,
    distance: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    lastTap: 0,
  });

  const mouseStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  });

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || null,
    [activeIndex, images],
  );

  // Keyboard navigation & strict scroll lock on both body & documentElement
  useEffect(() => {
    if (!open) return undefined;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

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
        setZoom((current) => {
          const next = clampZoom(current - ZOOM_STEP);
          if (next <= 1.05) setPan({ x: 0, y: 0 });
          return next;
        });
      }

      if (event.key === "0") {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onClose, onSelect, open]);

  // Native non-passive wheel listener on overlay: completely blocks outer page scrolling
  useEffect(() => {
    if (!open) return undefined;
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom((current) => {
        const next = clampZoom(current + delta);
        if (next <= 1.05) setPan({ x: 0, y: 0 });
        return next;
      });
    };

    overlay.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      overlay.removeEventListener("wheel", handleNativeWheel);
    };
  }, [open]);

  // Native non-passive touch listener to prevent touch scroll leakage
  useEffect(() => {
    if (!open) return undefined;
    const stage = containerRef.current;
    if (!stage) return undefined;

    const handleNativeTouchMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    stage.addEventListener("touchmove", handleNativeTouchMove, { passive: false });

    return () => {
      stage.removeEventListener("touchmove", handleNativeTouchMove);
    };
  }, [open]);

  // Reset zoom & pan when image changes or opens
  useEffect(() => {
    if (open) {
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    }
  }, [activeIndex, open]);

  if (!open || !activeImage || typeof document === "undefined") {
    return null;
  }

  // --- Touch Gestures (Pinch to Zoom & Drag to Pan) ---
  const getTouchDistance = (touches) =>
    Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );

  const handleTouchStart = (e) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.touches.length === 2) {
      touchStateRef.current.type = "pinch";
      touchStateRef.current.distance = getTouchDistance(e.touches);
      touchStateRef.current.startScale = zoom;
      setIsInteracting(true);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      const lastTap = touchStateRef.current.lastTap;

      // Double tap to zoom
      if (now - lastTap < 300) {
        e.preventDefault();
        if (zoom > 1.2) {
          setZoom(MIN_ZOOM);
          setPan({ x: 0, y: 0 });
        } else {
          const rect = container.getBoundingClientRect();
          const tapX = e.touches[0].clientX - rect.left - rect.width / 2;
          const tapY = e.touches[0].clientY - rect.top - rect.height / 2;
          setZoom(2.5);
          setPan({ x: -tapX * 0.75, y: -tapY * 0.75 });
        }
        touchStateRef.current.lastTap = 0;
        return;
      }
      touchStateRef.current.lastTap = now;

      touchStateRef.current.type = "pan";
      touchStateRef.current.startX = e.touches[0].clientX;
      touchStateRef.current.startY = e.touches[0].clientY;
      touchStateRef.current.panX = pan.x;
      touchStateRef.current.panY = pan.y;
      setIsInteracting(true);
    }
  };

  const handleTouchMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    if (touchStateRef.current.type === "pinch" && e.touches.length === 2) {
      const currentDist = getTouchDistance(e.touches);
      const ratio = currentDist / (touchStateRef.current.distance || 1);
      const nextZoom = clampZoom(touchStateRef.current.startScale * ratio);
      setZoom(nextZoom);
      if (nextZoom <= 1.05) {
        setPan({ x: 0, y: 0 });
      }
    } else if (touchStateRef.current.type === "pan" && e.touches.length === 1 && zoom > 1) {
      const deltaX = e.touches[0].clientX - touchStateRef.current.startX;
      const deltaY = e.touches[0].clientY - touchStateRef.current.startY;

      const maxPanX = (container.clientWidth * (zoom - 1)) / 2 + 80;
      const maxPanY = (container.clientHeight * (zoom - 1)) / 2 + 80;

      const targetX = touchStateRef.current.panX + deltaX;
      const targetY = touchStateRef.current.panY + deltaY;

      setPan({
        x: Math.min(maxPanX, Math.max(-maxPanX, targetX)),
        y: Math.min(maxPanY, Math.max(-maxPanY, targetY)),
      });
    }
  };

  const handleTouchEnd = (e) => {
    // If was at 1x and swiped horizontally across > 50px, switch photo
    if (touchStateRef.current.type === "pan" && zoom <= 1.05 && images.length > 1 && e.changedTouches?.length) {
      const swipeDeltaX = e.changedTouches[0].clientX - touchStateRef.current.startX;
      if (swipeDeltaX < -50) {
        onSelect?.((activeIndex + 1) % images.length);
      } else if (swipeDeltaX > 50) {
        onSelect?.((activeIndex - 1 + images.length) % images.length);
      }
    }

    setIsInteracting(false);
    touchStateRef.current.type = null;
    if (zoom <= 1.05) {
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 || zoom <= 1) return;
    mouseStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsInteracting(true);
  };

  const handleMouseMove = (e) => {
    if (!mouseStateRef.current.isDragging || zoom <= 1) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = e.clientX - mouseStateRef.current.startX;
    const deltaY = e.clientY - mouseStateRef.current.startY;

    const maxPanX = (container.clientWidth * (zoom - 1)) / 2 + 80;
    const maxPanY = (container.clientHeight * (zoom - 1)) / 2 + 80;

    const targetX = mouseStateRef.current.panX + deltaX;
    const targetY = mouseStateRef.current.panY + deltaY;

    setPan({
      x: Math.min(maxPanX, Math.max(-maxPanX, targetX)),
      y: Math.min(maxPanY, Math.max(-maxPanY, targetY)),
    });
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDragging = false;
    setIsInteracting(false);
  };

  const handleDoubleClick = (e) => {
    const container = containerRef.current;
    if (!container) return;
    if (zoom > 1.2) {
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    } else {
      const rect = container.getBoundingClientRect();
      const tapX = e.clientX - rect.left - rect.width / 2;
      const tapY = e.clientY - rect.top - rect.height / 2;
      setZoom(2.5);
      setPan({ x: -tapX * 0.75, y: -tapY * 0.75 });
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
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
                  title="Ảnh trước (Phím mũi tên trái)"
                >
                  ← Trước
                </button>
                <button
                  type="button"
                  className="image-lightbox__button"
                  onClick={() => onSelect?.((activeIndex + 1) % images.length)}
                  title="Ảnh sau (Phím mũi tên phải)"
                >
                  Sau →
                </button>
              </>
            ) : null}
          </div>

          <div className="image-lightbox__toolbar-group">
            <button
              type="button"
              className="image-lightbox__button"
              onClick={() =>
                setZoom((current) => {
                  const next = clampZoom(current - ZOOM_STEP);
                  if (next <= 1.05) setPan({ x: 0, y: 0 });
                  return next;
                })
              }
              disabled={zoom <= MIN_ZOOM}
              title="Thu nhỏ (-)"
            >
              ➖ Thu nhỏ
            </button>
            <button
              type="button"
              className="image-lightbox__button"
              onClick={() => {
                setZoom(MIN_ZOOM);
                setPan({ x: 0, y: 0 });
              }}
              disabled={zoom === MIN_ZOOM}
              title="Vừa khung"
            >
              ↺ Vừa khung
            </button>
            <button
              type="button"
              className="image-lightbox__button image-lightbox__button--primary"
              onClick={() =>
                setZoom((current) => clampZoom(current + ZOOM_STEP))
              }
              disabled={zoom >= MAX_ZOOM}
              title="Phóng to (+)"
            >
              ➕ Phóng to
            </button>
            <button
              type="button"
              className="image-lightbox__button image-lightbox__button--close"
              onClick={onClose}
              title="Đóng (Esc)"
            >
              ✕ Đóng
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="image-lightbox__stage"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          <img
            src={activeImage.url || DEFAULT_PLACEHOLDER}
            alt={activeImage.altText || title}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
              transition: isInteracting ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: zoom > 1 ? (isInteracting ? "grabbing" : "grab") : "zoom-in",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            draggable={false}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PLACEHOLDER;
            }}
          />

          <div className="art-3d-hint zoom-interactive-hint">
            <span className="hint-desktop">💡 Cuộn chuột để phóng to • Kéo để di chuyển ảnh</span>
            <span className="hint-mobile">📱 Chụm hoặc mở hai ngón tay để thu phóng • Kéo để di chuyển ảnh</span>
          </div>
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

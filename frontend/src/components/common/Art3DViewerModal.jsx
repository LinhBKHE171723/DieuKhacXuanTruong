import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4.5;
const ZOOM_STEP = 0.5;

export function Art3DViewerModal({ open, onClose, imageUrl, title }) {
  const [scale, setScale] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const touchStateRef = useRef({
    type: null, // 'pan' | 'pinch'
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

  // Strict scroll lock on both body & documentElement and handle Escape key
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

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleReset();
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
  }, [open, onClose]);

  // Native non-passive wheel listener on overlay: halts outer page scroll completely
  useEffect(() => {
    if (!open) return undefined;
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setScale((prev) => {
        const next = clampScale(prev + delta);
        if (next <= 1.05) setPan({ x: 0, y: 0 });
        return next;
      });
    };

    overlay.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      overlay.removeEventListener("wheel", handleNativeWheel);
    };
  }, [open]);

  // Native non-passive touchmove listener to prevent touch scroll leakage
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

  // Reset scale and pan when opening a new image
  useEffect(() => {
    if (open) {
      setScale(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    }
  }, [open, imageUrl]);

  if (!open || !imageUrl || typeof document === "undefined") {
    return null;
  }

  // --- Zoom helpers ---
  const clampScale = (value) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));

  const handleZoomIn = () => {
    setScale((prev) => clampScale(prev + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = clampScale(prev - ZOOM_STEP);
      if (next <= 1.05) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  // --- Touch Gestures (Pinch to zoom & Touch pan) ---
  const getTouchDistance = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );
  };

  const handleTouchStart = (e) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.touches.length === 2) {
      // 2 fingers = Pinch to zoom
      const distance = getTouchDistance(e.touches);
      touchStateRef.current.type = "pinch";
      touchStateRef.current.distance = distance;
      touchStateRef.current.startScale = scale;
      setIsInteracting(true);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      const lastTap = touchStateRef.current.lastTap;

      // Double-tap to quick zoom (1x <-> 2.5x)
      if (now - lastTap < 300) {
        e.preventDefault();
        if (scale > 1.2) {
          setScale(MIN_ZOOM);
          setPan({ x: 0, y: 0 });
        } else {
          const rect = container.getBoundingClientRect();
          const tapX = e.touches[0].clientX - rect.left - rect.width / 2;
          const tapY = e.touches[0].clientY - rect.top - rect.height / 2;
          setScale(2.5);
          setPan({ x: -tapX * 0.75, y: -tapY * 0.75 });
        }
        touchStateRef.current.lastTap = 0;
        return;
      }
      touchStateRef.current.lastTap = now;

      // 1 finger = Pan (if zoomed in)
      if (scale > 1) {
        touchStateRef.current.type = "pan";
        touchStateRef.current.startX = e.touches[0].clientX;
        touchStateRef.current.startY = e.touches[0].clientY;
        touchStateRef.current.panX = pan.x;
        touchStateRef.current.panY = pan.y;
        setIsInteracting(true);
      }
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
      const nextScale = clampScale(touchStateRef.current.startScale * ratio);
      setScale(nextScale);
      if (nextScale <= 1.05) {
        setPan({ x: 0, y: 0 });
      }
    } else if (touchStateRef.current.type === "pan" && e.touches.length === 1 && scale > 1) {
      const deltaX = e.touches[0].clientX - touchStateRef.current.startX;
      const deltaY = e.touches[0].clientY - touchStateRef.current.startY;

      const maxPanX = (container.clientWidth * (scale - 1)) / 2 + 80;
      const maxPanY = (container.clientHeight * (scale - 1)) / 2 + 80;

      const targetX = touchStateRef.current.panX + deltaX;
      const targetY = touchStateRef.current.panY + deltaY;

      setPan({
        x: Math.min(maxPanX, Math.max(-maxPanX, targetX)),
        y: Math.min(maxPanY, Math.max(-maxPanY, targetY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
    touchStateRef.current.type = null;
    if (scale <= 1.05) {
      setScale(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    if (scale > 1) {
      mouseStateRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      setIsInteracting(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!mouseStateRef.current.isDragging || scale <= 1) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = e.clientX - mouseStateRef.current.startX;
    const deltaY = e.clientY - mouseStateRef.current.startY;

    const maxPanX = (container.clientWidth * (scale - 1)) / 2 + 80;
    const maxPanY = (container.clientHeight * (scale - 1)) / 2 + 80;

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
    if (scale > 1.2) {
      handleReset();
    } else {
      const rect = container.getBoundingClientRect();
      const tapX = e.clientX - rect.left - rect.width / 2;
      const tapY = e.clientY - rect.top - rect.height / 2;
      setScale(2.5);
      setPan({ x: -tapX * 0.75, y: -tapY * 0.75 });
    }
  };

  return createPortal(
    <div ref={overlayRef} className="art-3d-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="art-3d-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="art-3d-modal-header">
          <div className="zoom-modal-header-copy">
            <span className="art-3d-badge">🔍 Soi Chi Tiết Tác Phẩm Siêu Nét</span>
            <h3>{title || "Chi tiết tác phẩm điêu khắc"}</h3>
          </div>
          <button
            type="button"
            className="art-3d-close-btn"
            onClick={onClose}
            aria-label="Đóng cửa sổ soi ảnh"
            title="Đóng (Esc)"
          >
            ✕
          </button>
        </header>

        {/* Interactive Viewport Stage */}
        <div
          ref={containerRef}
          className="art-3d-stage-wrapper zoom-interactive-stage"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="zoom-image-carrier">
            <img
              src={imageUrl}
              alt={title || "Tác phẩm điêu khắc"}
              className="zoom-stage-image"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
                transition: isInteracting ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: scale > 1 ? (isInteracting ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f7f1e7'/%3E%3Ctext x='200' y='150' font-family='serif' font-size='16' fill='%23786f5f' text-anchor='middle'%3EĐiêu Khắc Xuân Trường%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Interactive Touch / Mouse Hint */}
          <div className="art-3d-hint zoom-interactive-hint">
            <span className="hint-desktop">💡 Cuộn chuột để phóng to / Bấm giữ kéo để soi chi tiết</span>
            <span className="hint-mobile">📱 Vuốt 2 ngón tay để zoom • Chạm đúp 2 lần để phóng to • Kéo để soi hoa văn</span>
          </div>
        </div>

        {/* Footer Toolbar with Quick Touch Controls */}
        <footer className="art-3d-modal-footer zoom-modal-footer">
          <div className="zoom-controls-group">
            <button
              type="button"
              className="zoom-btn"
              onClick={handleZoomOut}
              disabled={scale <= MIN_ZOOM}
              title="Thu nhỏ (-)"
            >
              ➖ Thu nhỏ
            </button>
            <span className="zoom-level-badge">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              className="zoom-btn"
              onClick={handleZoomIn}
              disabled={scale >= MAX_ZOOM}
              title="Phóng to (+)"
            >
              ➕ Phóng to
            </button>
            <button
              type="button"
              className="zoom-btn zoom-btn--reset"
              onClick={handleReset}
              disabled={scale === MIN_ZOOM}
              title="Đặt lại kích thước gốc"
            >
              ↺ Vừa khung
            </button>
          </div>

          <button type="button" className="art-3d-close-footer-btn" onClick={onClose}>
            Đóng
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export { Art3DViewerModal as ImageZoomModal };

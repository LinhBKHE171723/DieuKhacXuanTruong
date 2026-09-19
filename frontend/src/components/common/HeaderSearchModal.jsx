import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { publicApi } from "../../api/publicApi";

export function HeaderSearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await publicApi.getProducts({ search: query, limit: 6 });
        setResults(data.items || []);
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open || typeof document === "undefined") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/san-pham?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return createPortal(
    <div className="header-search-modal-overlay" onClick={onClose}>
      <div
        className="header-search-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <form className="header-search-modal-form" onSubmit={handleSubmit}>
          <span className="header-search-icon">🔍</span>
          <input
            type="text"
            className="header-search-input"
            placeholder="Tìm kiếm tác phẩm điêu khắc, phù điêu, hoa văn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => setQuery("")}
            >
              ✕
            </button>
          )}
          <button type="submit" className="button button--primary header-search-submit">
            Tìm kiếm
          </button>
        </form>

        {/* Live Search Results Suggestion */}
        <div className="header-search-results-panel">
          {isLoading ? (
            <div className="header-search-loading">Đang tìm kiếm tác phẩm...</div>
          ) : results.length > 0 ? (
            <div className="header-search-results-list">
              <span className="header-search-section-label">
                Gợi ý tác phẩm ({results.length})
              </span>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/san-pham/${product.slug}`}
                  className="header-search-item"
                  onClick={onClose}
                >
                  <img
                    src={product.thumbnail || product.images?.[0]?.url}
                    alt={product.name}
                    className="header-search-item-thumb"
                  />
                  <div className="header-search-item-info">
                    <span className="header-search-item-cat">
                      {product.category?.name || "Điêu khắc"}
                    </span>
                    <strong className="header-search-item-name">{product.name}</strong>
                    <small className="header-search-item-mat">
                      Chất liệu: {product.material || "Cao cấp"}
                    </small>
                  </div>
                  <span className="header-search-item-arrow">→</span>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="header-search-empty">
              Không tìm thấy sản phẩm trùng khớp với "{query}"
            </div>
          ) : (
            <div className="header-search-popular">
              <span className="header-search-section-label">Từ khóa phổ biến</span>
              <div className="header-search-tags">
                {[
                  "Phù điêu đầu rồng",
                  "Tượng thạch cao",
                  "Hoa văn đền chùa",
                  "Bê tông đúc sẵn",
                  "Cột tân cổ điển",
                  "Linh vật ngoại thất"
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="header-search-tag-chip"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

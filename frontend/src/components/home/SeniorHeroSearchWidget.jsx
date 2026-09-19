import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SeniorHeroSearchWidget({ categories = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedCat) params.set("categoryId", selectedCat);
    navigate(`/san-pham?${params.toString()}`);
  };

  return (
    <section className="senior-search-section">
      <div className="container">
        <div className="senior-search-card">
          <div className="senior-search-card__head">
            <span className="senior-search-badge">🔍 DỄ DÀNG TÌM KIẾM</span>
            <h2>Tìm Kiếm Mẫu Hoa Văn, Phù Điêu & Tượng Theo Yêu Cầu</h2>
            <p>Nhập tên mẫu sản phẩm hoặc chọn danh mục bên dưới để xem ảnh sản phẩm chi tiết nhất.</p>
          </div>

          <form className="senior-search-form" onSubmit={handleSearch}>
            {/* Category Selector */}
            <div className="senior-search-field senior-search-field--select">
              <label htmlFor="senior-cat-select">📁 Chọn loại sản phẩm:</label>
              <select
                id="senior-cat-select"
                className="senior-select-input"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                <option value="">✨ Tất cả các danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Text Search */}
            <div className="senior-search-field senior-search-field--input">
              <label htmlFor="senior-text-input">🔎 Nhập tên sản phẩm cần tìm:</label>
              <div className="senior-input-wrapper">
                <input
                  id="senior-text-input"
                  type="text"
                  className="senior-text-input"
                  placeholder="Ví dụ: Phù điêu hoa văn, Tượng Phật, Cột vòm biệt thự..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="senior-clear-btn"
                    onClick={() => setSearchTerm("")}
                    title="Xóa chữ"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="senior-search-field senior-search-field--btn">
              <button type="submit" className="button button--primary senior-submit-btn">
                🔍 TÌM SẢN PHẨM
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

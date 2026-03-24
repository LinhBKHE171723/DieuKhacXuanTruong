export function ProductFilters({ categories = [], filters, onChange, searchLabel = "Tìm sản phẩm" }) {
  return (
    <div className="filters-panel">
      <div className="filters-panel__field">
        <label htmlFor="search">{searchLabel}</label>
        <input
          id="search"
          type="search"
          placeholder="Nhập tên cần tìm"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>

      <div className="filters-panel__field">
        <label htmlFor="category">Danh mục</label>
        <select
          id="category"
          value={filters.categoryId}
          onChange={(event) => onChange({ ...filters, categoryId: event.target.value })}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

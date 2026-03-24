export function ErrorState({ title = "Đã xảy ra lỗi", message = "Không thể tải dữ liệu lúc này." }) {
  return (
    <div className="state-card state-card--error">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

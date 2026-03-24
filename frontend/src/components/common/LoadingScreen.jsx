export function LoadingScreen({ label = "Đang tải dữ liệu..." }) {
  return (
    <div className="state-card">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

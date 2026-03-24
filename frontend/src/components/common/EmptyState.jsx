export function EmptyState({ title = "Chưa có dữ liệu", message = "Nội dung sẽ được cập nhật sớm." }) {
  return (
    <div className="state-card">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

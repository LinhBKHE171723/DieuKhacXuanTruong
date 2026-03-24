import { Tag } from "antd";

export function StatusTag({ value }) {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "PROCESSED") {
    return <Tag color="green">Đã xử lý</Tag>;
  }
  if (normalized === "NEW") {
    return <Tag color="gold">Mới</Tag>;
  }
  if (value === true) {
    return <Tag color="green">Đang hiển thị</Tag>;
  }
  if (value === false) {
    return <Tag color="default">Đang ẩn</Tag>;
  }
  return <Tag>{String(value)}</Tag>;
}

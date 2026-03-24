import { Link } from "react-router-dom";
import { Seo } from "../components/common/Seo";

export function NotFoundPage() {
  return (
    <section className="section not-found">
      <Seo title="404 - Không tìm thấy trang" description="Trang bạn tìm không tồn tại." />
      <div className="container state-card">
        <span className="section-title__eyebrow">404</span>
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn không tồn tại hoặc nội dung đã được thay đổi.</p>
        <Link className="button button--primary" to="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}

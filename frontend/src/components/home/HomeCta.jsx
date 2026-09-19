import { Link } from "react-router-dom";

export function HomeCta({ cta = {} }) {
  const notes = [
    "Dựng mẫu 3D & tư vấn bố cục hoa văn theo bản vẽ kiến trúc",
    "Đội ngũ nghệ nhân thi công trực tiếp tại công trình",
    "Cam kết tiến độ & độ bền vật liệu dài lâu (Bê tông GFRC/Thạch cao)"
  ];

  return (
    <section className="section home-cta-section-luxury">
      <div className="container">
        <div className="cta-panel-luxury">
          <div className="cta-panel-luxury__copy">
            <span className="gold-eyebrow-chip">📞 Tư Vấn & Báo Giá Trực Tiếp</span>
            <h2>{cta.title || "Cần Tư Vấn Phương Án Hoa Văn & Điêu Khắc Cho Công Trình?"}</h2>
            <p>{cta.description || "Liên hệ ngay với xưởng Điêu Khắc Xuân Trường để nhận hồ sơ mẫu, tư vấn chất liệu và giải pháp tối ưu chi phí cho biệt thự, nhà ở hoặc công trình tâm linh của bạn."}</p>
          </div>

          <div className="cta-panel-luxury__notes">
            {notes.map((note, index) => (
              <div key={note} className="cta-note-item">
                <span className="note-num">0{index + 1}</span>
                <span>{note}</span>
              </div>
            ))}
          </div>

          <div className="cta-panel-luxury__actions">
            <a
              href="https://zalo.me/0909888668"
              target="_blank"
              rel="noreferrer"
              className="button button--primary-gold-full"
              style={{ maxWidth: "260px" }}
            >
              💬 Chat Zalo 0909 888 668
            </a>
            <a
              href="tel:0909888668"
              className="button button--ghost"
              style={{ borderColor: "#c59b27", color: "#e8d5a7" }}
            >
              📞 Gọi Hotline Ngay
            </a>
            <Link className="button button--ghost" to="/lien-he">
              ✉️ Gửi Yêu Cầu Báo Giá
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

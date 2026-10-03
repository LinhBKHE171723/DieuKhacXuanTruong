import { Link } from "react-router-dom";

export function HomeCta({ cta = {} }) {
  const notes = [
    "Tư vấn mẫu và bố cục hoa văn theo bản vẽ kiến trúc",
    "Đội ngũ nghệ nhân thi công trực tiếp tại công trình",
    "Tư vấn vật liệu phù hợp với vị trí và điều kiện sử dụng"
  ];

  return (
    <section className="section home-cta-section-luxury">
      <div className="container">
        <div className="cta-panel-luxury">
          <div className="cta-panel-luxury__copy">
            <span className="gold-eyebrow-chip">📞 Tư vấn và báo giá</span>
            <h2>{cta.title || "Quý khách cần tư vấn cho công trình?"}</h2>
            <p>{cta.description || "Gửi mẫu tham khảo, bản vẽ hoặc kích thước hạng mục để xưởng tư vấn chất liệu, phương án thi công và báo giá."}</p>
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
              📞 Gọi tư vấn
            </a>
            <Link className="button button--ghost" to="/lien-he">
              ✉️ Gửi yêu cầu báo giá
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

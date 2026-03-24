import { Link } from "react-router-dom";

export function HomeCta({ cta = {} }) {
  const notes = [
    "Định hướng bố cục theo không gian thực tế",
    "Gợi ý vật liệu và cách hoàn thiện phù hợp",
    "Thống nhất rõ tiến độ trước khi triển khai"
  ];

  return (
    <section className="section home-cta-section">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-panel__copy">
            <span className="section-title__eyebrow">Tư vấn dự án</span>
            <h2>{cta.title || "Trao đổi nhanh để chốt phương án phù hợp"}</h2>
            {cta.description ? <p>{cta.description}</p> : null}
          </div>
          <div className="cta-panel__notes">
            {notes.map((note, index) => (
              <div key={note} className="cta-panel__note">
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{note}</span>
              </div>
            ))}
          </div>
          <div className="cta-panel__footer">
            <p>Khối tư vấn được rút gọn để người xem đọc nhanh và thao tác ngay trên mọi màn hình.</p>
            <div className="cta-panel__actions">
              <Link className="button button--primary" to={cta.primaryLink || "/lien-he"}>
                {cta.primaryText || "Liên hệ ngay"}
              </Link>
              <Link className="button button--ghost" to={cta.secondaryLink || "/cong-trinh"}>
                {cta.secondaryText || "Xem dự án"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

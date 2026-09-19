import React from "react";

export function FloatingContactWidget({ settings = {} }) {
  const phone = settings.hotline || "0909888668";
  const formattedPhone = settings.hotline || "0909 888 668";
  const zaloUrl = settings.zaloUrl || `https://zalo.me/${phone.replace(/\D/g, "")}`;

  return (
    <aside className="senior-floating-contact" aria-label="Tư vấn nhanh">
      <a
        href={`tel:${phone}`}
        className="floating-btn floating-btn--phone"
        title={`Gọi điện tư vấn trực tiếp: ${formattedPhone}`}
      >
        <span className="floating-btn__icon">📞</span>
        <span className="floating-btn__label">
          <small>TƯ VẤN MIỄN PHÍ</small>
          <strong>{formattedPhone}</strong>
        </span>
      </a>

      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        className="floating-btn floating-btn--zalo"
        title="Chat Zalo hỗ trợ tức thì"
      >
        <span className="floating-btn__icon">💬</span>
        <span className="floating-btn__label">
          <small>CHAT TƯ VẤN</small>
          <strong>Nhanh Qua Zalo</strong>
        </span>
      </a>
    </aside>
  );
}

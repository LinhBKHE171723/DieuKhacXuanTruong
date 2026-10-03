import { useState } from "react";
import { ImageLightbox } from "../common/ImageLightbox";
import "./legalProfile.css";

const documents = [1, 2].map((page) => ({
  url: `/images/nang-luc/phap-ly-da-che-${page}.webp`,
  altText: `Giấy chứng nhận đăng ký doanh nghiệp – trang ${page}, đã che thông tin cá nhân`
}));

export function LegalProfile() {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <section className="legal-profile" aria-labelledby="legal-profile-title">
      <div className="container legal-profile__layout">
        <div>
          <span className="section-title__eyebrow">Thông tin doanh nghiệp</span>
          <h2 id="legal-profile-title">Hồ sơ pháp lý</h2>
          <p>Thông tin đăng ký của Công ty TNHH Điêu Khắc Xuân Trường, trích từ hồ sơ năng lực năm 2025.</p>
          <dl>
            <div><dt>Tên doanh nghiệp</dt><dd>Công ty TNHH Điêu Khắc Xuân Trường</dd></div>
            <div><dt>Cơ quan cấp lần đầu</dt><dd>Sở Kế hoạch và Đầu tư tỉnh Nam Định</dd></div>
          </dl>
          <a className="button button--primary legal-profile__lookup" href="https://thuvienphapluat.vn/ma-so-thue/cong-ty-tnhh-dieu-khac-xuan-truong-mst-0601238222.html" target="_blank" rel="noopener noreferrer">Tra cứu tại Thư Viện Pháp Luật ↗</a>
          <p className="legal-profile__note">Bản công khai đã che thông tin cá nhân. Nhấn vào từng trang để xem rõ giấy chứng nhận.</p>
        </div>
        <div className="legal-profile__documents">
          {documents.map((document, index) => (
            <button key={document.url} type="button" className="legal-profile__document" onClick={() => setActiveIndex(index)} aria-label={`Phóng to giấy chứng nhận trang ${index + 1}`}>
              <img src={document.url} alt={document.altText} loading="lazy" decoding="async" />
              <span>Trang {index + 1} <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
      </div>
      <ImageLightbox images={documents} activeIndex={activeIndex ?? 0} onSelect={setActiveIndex} open={activeIndex !== null} onClose={() => setActiveIndex(null)} title="Hồ sơ pháp lý" />
    </section>
  );
}

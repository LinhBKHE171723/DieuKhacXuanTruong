import { Link } from "react-router-dom";
import "./thankYouSection.css";

export function ThankYouSection() {
  return (
    <section className="section thank-you-section" aria-labelledby="thank-you-title">
      <div className="container thank-you-section__layout">
        <div className="thank-you-section__copy">
          <span className="thank-you-section__eyebrow">Điêu Khắc Xuân Trường</span>
          <h2 id="thank-you-title">Trân trọng cảm ơn</h2>
          <p>Xin chân thành cảm ơn quý khách hàng và đối tác đã tin tưởng, đồng hành cùng Điêu Khắc Xuân Trường.</p>
          <p>Chúng tôi trân trọng từng cơ hội hợp tác và mong tiếp tục góp sức trong những công trình sắp tới của quý khách.</p>
          <Link className="button button--primary" to="/lien-he">Liên hệ với Xuân Trường</Link>
        </div>
        <img className="thank-you-section__image" src="/images/local-portfolio/biet-thu-loi-cam-on.webp" alt="Mặt tiền biệt thự với hệ cột và hoa văn tân cổ điển" loading="lazy" decoding="async" width="989" height="1642" />
      </div>
    </section>
  );
}

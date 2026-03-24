import { Link } from "react-router-dom";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const bannerActions = [
  { label: "Xem sản phẩm", to: "/san-pham" },
  { label: "Giới thiệu", to: "/gioi-thieu" },
  { label: "Xem công trình", to: "/cong-trinh" },
  { label: "Liên hệ", to: "/lien-he" }
];

function BannerLink({ to, children, variant = "primary" }) {
  if (!to) {
    return null;
  }

  const className =
    variant === "action"
      ? "hero-slider__action"
      : `button ${variant === "primary" ? "button--primary" : "button--ghost"}`;

  if (/^https?:\/\//.test(to)) {
    return (
      <a className={className} href={to} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export function HeroSlider({ banners = [] }) {
  if (!banners.length) {
    return null;
  }

  return (
    <section className="hero-slider-shell">
      <div className="hero-slider">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          speed={900}
          autoplay={banners.length > 1 ? { delay: 5600, disableOnInteraction: false } : false}
          loop={banners.length > 1}
          pagination={{ clickable: true }}
          className="hero-slider__swiper"
        >
          {banners.map((banner, index) => {
            return (
              <SwiperSlide key={banner.id}>
                <article className="hero-slide">
                  <div className="hero-slide__media">
                    <img
                      src={banner.imageUrl}
                      alt={`Banner trang chu ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      width="1280"
                      height="720"
                      sizes="(min-width: 1320px) 1280px, calc(100vw - 32px)"
                    />
                  </div>
                  <div className="hero-slide__overlay" />
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="hero-slider__actions" aria-label="Loi tat dieu huong nhanh">
        {bannerActions.map((action) => (
          <BannerLink key={action.to} variant="action" to={action.to}>
            {action.label}
          </BannerLink>
        ))}
      </div>
    </section>
  );
}

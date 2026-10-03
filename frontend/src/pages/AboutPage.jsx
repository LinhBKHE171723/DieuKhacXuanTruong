import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { AboutStoryCard } from "../components/about/AboutStoryCard";
import { CapabilityGallery } from "../components/about/CapabilityGallery";
import { ConstructionCapacity } from "../components/about/ConstructionCapacity";
import { ThankYouSection } from "../components/about/ThankYouSection";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { SectionTitle } from "../components/common/SectionTitle";
import { getAboutStories } from "../utils/aboutContent";

export function AboutPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["about-page"],
    queryFn: publicApi.getAbout
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  const stories = getAboutStories(data);
  const values = (data.sections?.values || []).filter((v) => v?.title || v?.description);
  const capabilities = (data.sections?.capabilities || []).filter(Boolean);
  const vision = data.sections?.vision;
  const mission = data.sections?.mission;
  // Xử lý triệt để ký tự khoảng trắng không ngắt dòng (&nbsp; và \u00A0) gây tràn chữ ra ngoài màn hình
  const rawContent = (data.content || "").replace(/&nbsp;|\u00A0/g, " ");

  return (
    <>
      <Seo title={data.metaTitle || data.title} description={data.metaDescription} />

      <section className="section about-page-section">
        <div className="container">
          {/* Header gọn gàng, thanh lịch */}
          <div className="about-compact-header">
            <span className="about-compact-header__eyebrow">Giới thiệu xưởng</span>
            <h1 className="about-compact-header__title">Công ty Điêu Khắc Xuân Trường</h1>
            <p className="about-compact-header__desc">
              Chế tác và thi công hoa văn kiến trúc, phù điêu, tượng nghệ thuật và cấu kiện bê tông mỹ thuật cao cấp.
            </p>
          </div>

          {/* 2 cột cân bằng: Cột trái Giới thiệu & Hành động, Cột phải Tầm nhìn & Sứ mệnh */}
          <div className="about-overview-grid">
            {/* Cột trái: Nội dung giới thiệu tổng quan */}
            <div className="about-overview-card">
              <div>
                <span className="section-title__eyebrow">Tổng quan</span>
                <h2>Chế tác điêu khắc và thi công hoa văn</h2>
                {rawContent ? (
                  <div
                    className="about-lead-text rich-content"
                    dangerouslySetInnerHTML={{ __html: rawContent }}
                  />
                ) : (
                  <p className="about-lead-text">
                    Xuân Trường chế tác hoa văn, phù điêu, tượng và cấu kiện trang trí kiến trúc, kết hợp sản xuất tại xưởng với lắp đặt tại công trình.
                  </p>
                )}
              </div>

              <div className="about-overview-actions">
                <Link className="button button--primary" to="/lien-he">
                  Liên hệ tư vấn dự án →
                </Link>
                <Link className="button button--ghost" to="/cong-trinh">
                  Xem công trình thực tế
                </Link>
              </div>
            </div>

            {/* Cột phải: 2 thẻ Tầm nhìn & Sứ mệnh cân đối */}
            <div className="about-pillars">
              {vision ? (
                <div className="about-pillar-card about-pillar-card--vision">
                  <div className="about-pillar-card__header">
                    <span className="about-pillar-card__icon">👁️</span>
                    <div>
                      <span className="about-pillar-card__badge">Tầm nhìn chiến lược</span>
                      <h3 className="about-pillar-card__title">Định hướng thương hiệu</h3>
                    </div>
                  </div>
                  <p className="about-pillar-card__text">{vision}</p>
                </div>
              ) : null}

              {mission ? (
                <div className="about-pillar-card about-pillar-card--mission">
                  <div className="about-pillar-card__header">
                    <span className="about-pillar-card__icon">🎯</span>
                    <div>
                      <span className="about-pillar-card__badge">Sứ mệnh phát triển</span>
                      <h3 className="about-pillar-card__title">Giá trị mang lại</h3>
                    </div>
                  </div>
                  <p className="about-pillar-card__text">{mission}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Khối Điểm nhấn & Giá trị cốt lõi (3 thẻ ngang cân đối) */}
          {values.length ? (
            <div className="about-values-section">
              <div className="about-section-heading">
                <span className="section-title__eyebrow">Giá trị cốt lõi</span>
                <h2>Điểm nhấn chất lượng chế tác</h2>
                <p>Chúng tôi chú trọng đường nét, tỷ lệ và lựa chọn vật liệu phù hợp với từng hạng mục.</p>
              </div>
              <div className="about-values-grid">
                {values.slice(0, 3).map((val, idx) => (
                  <div key={idx} className="about-value-item">
                    <div className="about-value-item__num">0{idx + 1}</div>
                    <h3 className="about-value-item__title">{val.title}</h3>
                    <p className="about-value-item__desc">{val.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Khối Năng lực triển khai (3 thẻ ngang) */}
          {capabilities.length ? (
            <div className="about-capabilities-section">
              <div className="about-section-heading">
                <span className="section-title__eyebrow">Quy trình và năng lực</span>
                <h2>Năng lực triển khai toàn diện</h2>
                <p>Từ khâu phác thảo ý tưởng đến khi lắp dựng hoàn thiện trên công trường.</p>
              </div>
              <div className="about-capabilities-grid">
                {capabilities.slice(0, 3).map((cap, idx) => {
                  const icons = ["📐", "🏗️", "🏛️"];
                  return (
                    <div key={idx} className="about-cap-item">
                      <span className="about-cap-item__icon">{icons[idx] || "✨"}</span>
                      <p className="about-cap-item__text">{cap}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <CapabilityGallery />
      <ConstructionCapacity />

      {/* Bài viết câu chuyện xưởng */}
      {stories.length ? (
        <section className="section about-stories">
          <div className="container">
            <SectionTitle
              eyebrow="Bài viết giới thiệu"
              title="Câu chuyện từ xưởng"
              description="Tìm hiểu con người, công việc và các công đoạn chế tác tại Xuân Trường."
              size="compact"
            />
            <div className="about-story-grid">
              {stories.map((story, index) => (
                <AboutStoryCard key={story.slug} story={story} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {import.meta.env.DEV && <ThankYouSection />}
    </>
  );
}

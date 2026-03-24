import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { AboutStoryCard } from "../components/about/AboutStoryCard";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { SectionTitle } from "../components/common/SectionTitle";
import { getAboutStories, stripHtml } from "../utils/aboutContent";

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
  const values = (data.sections?.values || []).filter((value) => value?.title || value?.description);
  const capabilities = (data.sections?.capabilities || []).filter(Boolean);
  const compactValues = values.slice(0, 3);
  const compactCapabilities = capabilities.slice(0, 3);
  const hasVision = Boolean(data.sections?.vision);
  const hasMission = Boolean(data.sections?.mission);
  const hasLeadContent = Boolean(stripHtml(data.content || ""));

  return (
    <>
      <Seo title={data.metaTitle || data.title} description={data.metaDescription} />

      <section className="section about-editorial">
        <div className="container about-editorial__grid">
          <Reveal>
            <div className="about-editorial__lead">
              <span className="section-title__eyebrow">Giới thiệu</span>
              <h1>{data.title}</h1>
              {hasVision ? <p className="detail-summary">{data.sections.vision}</p> : null}
              {hasLeadContent ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.content }} /> : null}
              {compactValues.length || compactCapabilities.length ? (
                <div className="about-editorial__summary">
                  {compactValues.length ? (
                    <div className="about-editorial__summary-block">
                      <span className="section-title__eyebrow">Điểm nhấn</span>
                      <div className="about-editorial__summary-grid">
                        {compactValues.map((value, index) => (
                          <article key={`${value.title || value.description || "value"}-${index}`} className="about-summary-card">
                            {value.title ? (
                              <>
                                <strong>{value.title}</strong>
                                {value.description ? <p>{value.description}</p> : null}
                              </>
                            ) : value.description ? (
                              <strong>{value.description}</strong>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {compactCapabilities.length ? (
                    <div className="about-editorial__summary-block about-editorial__summary-block--list">
                      <span className="section-title__eyebrow">Năng lực</span>
                      <ul>
                        {compactCapabilities.map((capability) => (
                          <li key={capability}>{capability}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="about-editorial__actions">
                <Link className="button button--primary" to="/lien-he">
                  Trao đổi dự án
                </Link>
                <Link className="button button--ghost" to="/cong-trinh">
                  Xem công trình thực tế
                </Link>
              </div>
            </div>
          </Reveal>

          {hasVision || hasMission ? (
            <div className="about-editorial__aside">
              {hasVision ? (
                <Reveal delay={0.08}>
                  <div className="info-panel about-callout">
                    <span className="section-title__eyebrow">Tầm nhìn</span>
                    <h3>{data.sections.vision}</h3>
                  </div>
                </Reveal>
              ) : null}
              {hasMission ? (
                <Reveal delay={0.16}>
                  <div className="info-panel about-callout about-callout--accent">
                    <span className="section-title__eyebrow">Sứ mệnh</span>
                    <h3>{data.sections.mission}</h3>
                  </div>
                </Reveal>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {stories.length ? (
        <section className="section about-stories">
          <div className="container">
            <SectionTitle
              eyebrow="Bài viết giới thiệu"
              title="Các bài viết về xưởng và quy trình"
              description="Mở từng bài để xem nội dung chi tiết và ảnh rõ hơn."
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
    </>
  );
}

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { ImageLightbox } from "../components/common/ImageLightbox";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { SectionTitle } from "../components/common/SectionTitle";
import { AboutStoryCard } from "../components/about/AboutStoryCard";
import { getAboutStories, getAboutStoryBySlug, stripHtml } from "../utils/aboutContent";

export function AboutStoryPage() {
  const { storySlug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["about-page"],
    queryFn: publicApi.getAbout
  });

  const stories = useMemo(() => getAboutStories(data || {}), [data]);
  const story = useMemo(() => getAboutStoryBySlug(data || {}, storySlug), [data, storySlug]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data || !story) {
    return <ErrorState />;
  }

  return (
    <>
      <Seo title={story.title} description={story.summary || stripHtml(story.content).slice(0, 160)} />

      <section className="section about-story-page">
        <div className="container about-story-page__grid">
          <Reveal>
            <div className="about-story-page__content">
              <div className="about-story-page__topbar">
                <Link className="button button--ghost" to="/gioi-thieu">
                  Quay lại giới thiệu
                </Link>
                {story.tag ? <span className="section-title__eyebrow">{story.tag}</span> : null}
              </div>
              <div className="about-story-page__intro">
                <h1>{story.title}</h1>
                {story.summary ? <p className="detail-summary">{story.summary}</p> : null}
              </div>
              <div className="about-story-page__body rich-content" dangerouslySetInnerHTML={{ __html: story.content }} />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="about-story-page__aside">
              <button
                type="button"
                className="about-story-page__image"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Xem anh lon cua ${story.title}`}
              >
                <img src={story.imageUrl} alt={story.imageAlt} loading="eager" decoding="async" />
                <span className="detail-gallery__zoom-chip">Bấm để xem rõ ảnh</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {stories.filter((item) => item.slug !== story.slug).length ? (
        <section className="section section--soft">
          <div className="container">
            <SectionTitle
              eyebrow="Đọc thêm"
              title="Các bài viết liên quan"
              description="Mở thêm một bài viết khác để xem tiếp hình ảnh và nội dung chi tiết."
              size="compact"
            />
            <div className="about-story-grid">
              {stories
                .filter((item) => item.slug !== story.slug)
                .slice(0, 3)
                .map((item, index) => (
                  <AboutStoryCard key={item.slug} story={item} delay={index * 0.08} />
                ))}
            </div>
          </div>
        </section>
      ) : null}

      <ImageLightbox
        images={[
          {
            url: story.imageUrl,
            altText: story.imageAlt
          }
        ]}
        activeIndex={0}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelect={() => {}}
        title={story.title}
      />
    </>
  );
}

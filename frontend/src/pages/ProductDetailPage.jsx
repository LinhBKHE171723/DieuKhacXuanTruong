import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { ProductCard } from "../components/product/ProductCard";
import { ProductGallery } from "../components/product/ProductGallery";
import { parseDimensionOptions } from "../utils/productDimensions";

export function ProductDetailPage() {
  const { slug } = useParams();
  const [visibleRelated, setVisibleRelated] = useState(4);

  useEffect(() => {
    setVisibleRelated(4);
  }, [slug]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => publicApi.getProductDetail(slug)
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  const dimensionOptions = parseDimensionOptions(data.dimensions);

  return (
    <>
      <Seo title={data.metaTitle || data.name} description={data.metaDescription || data.shortDescription} />
      <section className="section detail-section">
        <div className="container detail-grid">
          <ProductGallery images={data.images} title={data.name} />
          <div className="detail-content">
            <span className="detail-label">{data.category?.name}</span>
            <h1>{data.name}</h1>
            <p className="detail-summary">{data.shortDescription}</p>
            <div className="detail-meta">
              <div>
                <strong>Chất liệu</strong>
                <span>{data.material || "Cập nhật theo yêu cầu"}</span>
              </div>
              <div>
                <strong>Kích thước</strong>
                {dimensionOptions.length ? (
                  <div className="detail-dimension-list">
                    {dimensionOptions.map((dimension) => (
                      <span key={dimension}>{dimension}</span>
                    ))}
                  </div>
                ) : (
                  <span>Theo thiết kế</span>
                )}
              </div>
            </div>
            <div className="tag-list">
              {(data.tags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{
                __html: (data.content || "").replace(/&nbsp;|\u00A0/g, " ")
              }}
            />
            <Link className="button button--primary" to="/lien-he">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      {data.relatedProducts?.length ? (
        <section className="section section--soft related-products-showcase">
          <div className="container container--wide">
            <div className="section-title">
              <span className="section-title__eyebrow">Cùng quy cách mẫu mã</span>
              <h2>Sản phẩm cùng nhóm ({data.relatedProducts.length} mẫu kích thước)</h2>
            </div>
            <div className="card-grid--full-width">
              {data.relatedProducts.slice(0, visibleRelated).map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 0.04} />
              ))}
            </div>

            {data.relatedProducts.length > visibleRelated ? (
              <div className="related-load-more" style={{ textAlign: "center", marginTop: "36px" }}>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setVisibleRelated((prev) => prev + 4)}
                >
                  ↓ Xem thêm quy cách khác (còn {data.relatedProducts.length - visibleRelated} mẫu)
                </button>
              </div>
            ) : data.categoryId || data.category?.id ? (
              <div className="related-load-more" style={{ textAlign: "center", marginTop: "36px" }}>
                <Link
                  to={`/san-pham?categoryId=${data.categoryId || data.category?.id}`}
                  className="button button--primary-gold-outline"
                >
                  Xem toàn bộ mẫu trong danh mục {data.category?.name || ""} →
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

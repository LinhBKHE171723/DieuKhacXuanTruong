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
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.content }} />
            <Link className="button button--primary" to="/lien-he">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      {data.relatedProducts?.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="section-title">
              <span className="section-title__eyebrow">Liên quan</span>
              <h2>Sản phẩm cùng nhóm</h2>
            </div>
            <div className="card-grid">
              {data.relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 0.05} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

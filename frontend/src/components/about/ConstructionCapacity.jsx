import { useState } from "react";
import { ImageLightbox } from "../common/ImageLightbox";
import "./constructionCapacity.css";

const images = [
  ["thi-cong-lap-dat", "Lắp đặt hoa văn trần tại công trình"],
  ["thi-cong-hoa-van", "Căn chỉnh chi tiết hoa văn trên trần"],
  ["thi-cong-ghep-tran", "Chuẩn bị và ghép các mảng trần trang trí"],
  ["che-tac-mau", "Chế tác mẫu hoa văn tại xưởng"]
].map(([file, altText]) => ({ url: `/images/nang-luc/${file}.webp`, altText }));

export function ConstructionCapacity() {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <section className="construction-capacity" aria-labelledby="construction-title">
      <div className="container">
        <div className="construction-capacity__heading">
          <div><span className="section-title__eyebrow">Con người & tay nghề</span><h2 id="construction-title">Năng lực thi công</h2></div>
          <p>Từ chế tác mẫu tại xưởng, chuẩn bị cấu kiện đến lắp đặt và căn chỉnh tại công trình. Hình ảnh đội ngũ làm việc được tuyển chọn từ hồ sơ năng lực Xuân Trường.</p>
        </div>
        <div className="construction-capacity__grid">
          {images.map((image, index) => (
            <button type="button" key={image.url} onClick={() => setActiveIndex(index)} aria-label={`Xem ảnh: ${image.altText}`}>
              <img src={image.url} alt={image.altText} loading="lazy" decoding="async" />
              <span><b>0{index + 1}</b>{image.altText}</span>
            </button>
          ))}
        </div>
        <p className="construction-capacity__scope">Phạm vi triển khai: biệt thự, nhà ở, công trình công cộng, đình chùa và khu vui chơi.</p>
      </div>
      <ImageLightbox images={images} activeIndex={activeIndex ?? 0} open={activeIndex !== null} onSelect={setActiveIndex} onClose={() => setActiveIndex(null)} title="Năng lực thi công" />
    </section>
  );
}

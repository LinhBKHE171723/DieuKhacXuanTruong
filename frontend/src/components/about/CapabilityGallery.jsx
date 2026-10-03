import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ImageLightbox } from "../common/ImageLightbox";
import "./capabilityGallery.css";

const photo = (file, altText) => ({ url: `/images/nang-luc/${file}.webp`, altText });
const groups = [
  {
    id: "xuong", title: "Xưởng & chế tác",
    description: "Không gian sản xuất và các cấu kiện trong quá trình chế tác tại xưởng.",
    images: [photo("17-xuong-che-tac", "Không gian xưởng chế tác Xuân Trường"), photo("18-cau-kien-tai-xuong", "Các cấu kiện cột tại xưởng"), photo("11-phao-chi-gfrc", "Phào chỉ GFRC tại xưởng")]
  },
  {
    id: "kien-truc", title: "Kiến trúc & mặt tiền",
    description: "Từ hệ cột, mái vòm đến hoa văn mặt tiền — những chi tiết tạo nên diện mạo công trình.",
    images: [photo("01-biet-thu-mai-vom", "Kiến trúc biệt thự mái vòm"), photo("02-biet-thu-ban-dem", "Mặt tiền biệt thự vào ban đêm"), photo("03-biet-thu-mat-tien", "Mặt tiền biệt thự và hệ cột cổng")]
  },
  {
    id: "noi-that", title: "Hoa văn nội thất",
    description: "Phào chỉ, trần trang trí và vòm cửa trong không gian mang phong cách tân cổ điển.",
    images: [photo("04-hoa-van-tran-vang", "Trần hoa văn tông vàng"), photo("05-phao-chi-vom-cua", "Phào chỉ trang trí vòm cửa"), photo("06-tran-vom-tan-co-dien", "Trần vòm trang trí tân cổ điển")]
  },
  {
    id: "chi-tiet", title: "Chi tiết chế tác",
    description: "Hoa văn hoa lá, đầu cột và phù điêu trang trí kiến trúc.",
    images: [photo("07-phu-dieu-hoa-la", "Phù điêu hoa lá trang trí"), photo("08-dau-cot-hoa-la", "Chi tiết đầu cột hoa lá"), photo("09-dau-cot-cuon", "Chi tiết đầu cột cuộn"), photo("14-rong-trang-tri", "Chi tiết rồng trang trí")]
  },
  {
    id: "canh-quan", title: "Tượng & cảnh quan",
    description: "Hình ảnh tượng nghệ thuật, linh vật và các chi tiết trang trí không gian ngoài trời.",
    images: [photo("12-tuong-phat-dung", "Tượng Phật đứng trên đài sen"), photo("13-tuong-ngua-co-canh", "Tượng ngựa có cánh"), photo("15-tuong-voi-san-vuon", "Tượng voi trong cảnh quan sân vườn"), photo("16-tuong-nhan-vat-khu-vui-choi", "Tượng nhân vật trong khu vui chơi")]
  }
];

export function CapabilityGallery({ compact = false }) {
  const sectionRef = useRef(null);
  const { hash } = useLocation();
  const [selected, setSelected] = useState("xuong");
  const [activeIndex, setActiveIndex] = useState(null);
  const group = groups.find((item) => item.id === selected) || groups[0];
  const previews = [groups[0], groups[1], groups[2], groups[4]];

  useEffect(() => {
    if (compact || hash !== "#hinh-anh-nang-luc") return undefined;
    const frame = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [compact, hash]);

  return (
    <section ref={sectionRef} className={`capability-gallery ${compact ? "capability-gallery--compact" : ""}`} id={compact ? "nang-luc" : "hinh-anh-nang-luc"} aria-label="Hình ảnh năng lực">
      <div className="container">
        <div className="capability-gallery__heading">
          <div>
            <span className="section-title__eyebrow">Dấu ấn Xuân Trường</span>
            <h2>{compact ? "Xưởng chế tác và công trình" : "Từ xưởng chế tác đến không gian kiến trúc"}</h2>
            <p>Khám phá xưởng chế tác, các chi tiết điêu khắc và công trình của Xuân Trường.</p>
          </div>
          {compact && <Link className="button button--ghost" to="/gioi-thieu#hinh-anh-nang-luc">Tìm hiểu về xưởng →</Link>}
        </div>
        {compact ? (
          <div className="capability-gallery__previews">
            {previews.map((item) => (
              <Link className="capability-gallery__preview" key={item.id} to="/gioi-thieu#hinh-anh-nang-luc">
                <img src={item.images[item.id === "canh-quan" ? 2 : 0].url} alt={item.images[item.id === "canh-quan" ? 2 : 0].altText} loading="lazy" decoding="async" />
                <span>{item.title} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="capability-gallery__filters" aria-label="Chủ đề hình ảnh">
              {groups.map((item) => (
                <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setActiveIndex(null); }}>
                  {item.title}<span>{item.images.length}</span>
                </button>
              ))}
            </div>
            <p className="capability-gallery__description">{group.description}</p>
            <div className={`capability-gallery__grid capability-gallery__grid--${group.id}`}>
              {group.images.map((item, index) => (
                <button className={`capability-gallery__photo ${group.id === "canh-quan" && index < 2 ? "capability-gallery__photo--portrait" : ""}`} type="button" key={item.url} onClick={() => setActiveIndex(index)} aria-label={`Xem ảnh lớn: ${item.altText}`}>
                  <span className="capability-gallery__frame"><img src={item.url} alt={item.altText} loading="lazy" decoding="async" /></span>
                  <span className="capability-gallery__caption">{item.altText}<span aria-hidden="true">↗</span></span>
                </button>
              ))}
            </div>
            <p className="capability-gallery__hint">Chạm vào ảnh để phóng to.</p>
            <ImageLightbox images={group.images} activeIndex={activeIndex ?? 0} open={activeIndex !== null} onClose={() => setActiveIndex(null)} onSelect={setActiveIndex} title={group.title} />
          </>
        )}
      </div>
    </section>
  );
}

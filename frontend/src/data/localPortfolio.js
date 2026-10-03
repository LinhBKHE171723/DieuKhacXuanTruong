// Local review only. No database or upload requests; excluded from production data.
export const localPortfolioEnabled = import.meta.env.DEV;

const item = (slug, name, shortDescription, extra = {}) => ({
  id: `local-${slug}`, slug: `local-${slug}`, name, shortDescription,
  thumbnail: `/images/local-portfolio/${slug}.webp`,
  images: [{ url: `/images/local-portfolio/${slug}.webp`, altText: name }],
  content: `<p>${shortDescription}</p><p>Liên hệ với xưởng để trao đổi về kích thước, vật liệu và phương án thực hiện phù hợp.</p>`,
  ...extra
});
const projects = [
  item("mat-tien-cua-vom", "Hoa văn mặt tiền cửa vòm", "Hệ cửa vòm, cột và hoa văn nổi trong quá trình thi công mặt tiền.", { scope: "Hoa văn mặt tiền và cửa vòm" }),
  item("kien-truc-mai-vom", "Hoa văn kiến trúc mái vòm", "Các chi tiết phù điêu, đầu cột và đường gờ trang trí công trình mái vòm.", { scope: "Hoa văn mái vòm và hệ cột" }),
  item("canh-quan-khu-vui-choi", "Tượng trang trí khu vui chơi", "Tượng nhân vật được bố trí trong không gian cây xanh và lối dạo.", { scope: "Tượng nhân vật và trang trí cảnh quan" })
];

export const localProjects = localPortfolioEnabled ? projects : [];

export function findLocalDetail(items, slug, relatedKey) {
  const selected = items.find((entry) => entry.slug === slug);
  return selected ? { ...selected, [relatedKey]: items.filter((entry) => entry.id !== selected.id) } : null;
}

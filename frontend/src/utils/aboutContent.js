const fallbackStoryImages = [
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
];

export const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const slugifyText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildLegacyStories = (page = {}) => {
  const sections = page.sections || {};
  const plainContent = stripHtml(page.content || "");
  const valuesMarkup = (sections.values || [])
    .map((item) => `<p><strong>${item.title || ""}</strong> ${item.description || ""}</p>`)
    .join("");
  const capabilitiesMarkup = (sections.capabilities || []).map((value) => `<li>${value}</li>`).join("");

  return [
    {
      tag: "Tổng quan xưởng",
      title: page.title || "Giới thiệu xưởng",
      slug: "tong-quan-xuong",
      summary: sections.vision || plainContent || "Tổng quan về xưởng và cách chúng tôi triển khai từng dự án.",
      imageUrl: fallbackStoryImages[0],
      imageAlt: page.title || "Giới thiệu xưởng",
      content: page.content || `<p>${sections.vision || plainContent}</p>`
    },
    {
      tag: "Triết lý chế tác",
      title: "Chất lượng đến từ kỷ luật thi công và cảm quan thẩm mỹ",
      slug: "triet-ly-che-tac",
      summary:
        sections.mission ||
        "Mỗi hạng mục được kiểm soát từ mẫu, khuôn, vật liệu đến bước hoàn thiện bề mặt để giữ độ sắc nét đồng đều.",
      imageUrl: fallbackStoryImages[1],
      imageAlt: "Triết lý chế tác",
      content: `<p>${sections.mission || "Chúng tôi ưu tiên tỷ lệ, độ bền và cảm giác hoàn thiện khi nhìn ở khoảng cách thực tế."}</p>${valuesMarkup}`
    },
    {
      tag: "Năng lực triển khai",
      title: "Từ ý tưởng đến lắp đặt thực tế tại công trình",
      slug: "nang-luc-trien-khai",
      summary:
        Array.isArray(sections.capabilities) && sections.capabilities.length
          ? sections.capabilities[0]
          : "Quy trình phối hợp giữa thiết kế, xưởng chế tác và đội thi công giúp tiến độ và chất lượng đồng bộ hơn.",
      imageUrl: fallbackStoryImages[2],
      imageAlt: "Năng lực triển khai",
      content: capabilitiesMarkup ? `<ul>${capabilitiesMarkup}</ul>` : ""
    }
  ].filter((story) => stripHtml(story.summary) || stripHtml(story.content));
};

export const getAboutStories = (page = {}) => {
  const stories = Array.isArray(page.sections?.stories) && page.sections.stories.length
    ? page.sections.stories
    : buildLegacyStories(page);

  return stories.map((story, index) => ({
    ...story,
    slug: story.slug || slugifyText(story.title || `bai-viet-${index + 1}`),
    imageUrl: story.imageUrl || fallbackStoryImages[index % fallbackStoryImages.length],
    imageAlt: story.imageAlt || story.title || page.title || "Bài viết giới thiệu"
  }));
};

export const getAboutStoryBySlug = (page = {}, slug = "") =>
  getAboutStories(page).find((story) => story.slug === slug);

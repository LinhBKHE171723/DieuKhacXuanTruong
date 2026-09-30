import sanitizeHtml from "sanitize-html";

export const sanitizeRichText = (value = "") => {
  const normalized = String(value || "").replace(/&nbsp;|\u00A0/g, " ");
  return sanitizeHtml(normalized, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "h4",
      "img",
      "figure",
      "figcaption",
      "iframe"
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "allow", "allowfullscreen", "frameborder"]
    },
    allowedSchemes: ["http", "https", "data", "mailto", "tel"]
  });
};

export const sanitizePlainText = (value = "") => {
  const normalized = String(value || "").replace(/&nbsp;|\u00A0/g, " ");
  return sanitizeHtml(normalized, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
};

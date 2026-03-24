import sanitizeHtml from "sanitize-html";

export const sanitizeRichText = (value = "") =>
  sanitizeHtml(value, {
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

export const sanitizePlainText = (value = "") =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();

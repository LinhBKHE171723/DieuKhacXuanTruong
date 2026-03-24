import slugify from "slugify";

export const makeSlug = (value) =>
  slugify(value || "", {
    lower: true,
    locale: "vi",
    strict: true,
    trim: true
  });

export const ensureUniqueSlug = async (model, value, excludeId = null) => {
  const baseSlug = makeSlug(value);
  let slug = baseSlug || `item-${Date.now()}`;
  let counter = 1;

  while (true) {
    const where = { slug };
    if (excludeId) {
      where._id = { $ne: excludeId };
    }

    const existing = await model.findOne(where);
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const dimensionSplitPattern = /[\n,;|]+/;

export const parseDimensionOptions = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => `${item || ""}`.trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(dimensionSplitPattern)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const serializeDimensionOptions = (value) => parseDimensionOptions(value).join("\n");

export const createMinLengthRule = (label, min) => ({
  validator: (_, value) => {
    const normalized = typeof value === "string" ? value.trim() : "";

    if (!normalized) {
      return Promise.reject(new Error(`Vui lòng nhập ${label.toLowerCase()}.`));
    }

    if (normalized.length < min) {
      return Promise.reject(new Error(`${label} phải có ít nhất ${min} ký tự.`));
    }

    return Promise.resolve();
  }
});

export const applyServerValidationToForm = (form, error) => {
  const details = Array.isArray(error?.details) ? error.details : [];
  const fieldEntries = details
    .filter((item) => Array.isArray(item?.path) && item.path[0] === "body" && item.path.length > 1)
    .map((item) => ({
      name: item.path.slice(1),
      errors: [item.message]
    }));

  if (!fieldEntries.length) {
    return false;
  }

  form.setFields(fieldEntries);
  form.scrollToField(fieldEntries[0].name, { block: "center", behavior: "smooth" });
  return true;
};

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (Array.isArray(error?.details) && error.details.length === 1) {
    return error.details[0].message;
  }

  return error?.message || fallbackMessage;
};

export const normalizePlates = (plates) => {
  if (!Array.isArray(plates)) return [];
  return [...new Set(plates.flatMap((value) => {
    if (typeof value === "string") {
      const plate = value.trim();
      return plate ? [plate] : [];
    }
    return Number.isSafeInteger(value) && value >= 0 ? [String(value)] : [];
  }))];
};

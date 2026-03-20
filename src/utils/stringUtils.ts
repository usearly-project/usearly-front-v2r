export const capitalizeFirstLetter = (text?: string) => {
  if (!text) return "";
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (s?: string, max = 10, ellipsis = "…") => {
  if (!s) return ""; // ✅ SAFE

  const str = String(s);

  return str.length > max ? str.slice(0, max) + ellipsis : str;
};

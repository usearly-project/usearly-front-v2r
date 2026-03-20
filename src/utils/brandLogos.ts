// ====================
// ✅ Placeholder générique
// ====================
const placeholderSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='%23f1f1f5'/><path d='M20 36.2c2.6 3.5 7 6.3 11.8 6.3 6.9 0 10.6-4.1 10.6-9.1 0-4.8-3.3-8.1-8.5-8.1-3.6 0-6.1 1.6-7.8 3.7l-5.3-2.9c2.8-4.1 7.3-6.4 13.4-6.4 9.1 0 15.2 5.8 15.2 13.9 0 8.5-6.1 14.9-16.3 14.9-7.1 0-12.8-3.4-15.8-8.2z' fill='%23848394'/></svg>";

export const FALLBACK_BRAND_PLACEHOLDER = `data:image/svg+xml;utf8,${placeholderSvg.replace(
  /#/g,
  "%23",
)}`;

// ====================
// ✅ Config & Cache
// ====================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const brandLogoCache = new Map<string, string>();

// ====================
// ✅ Normalisation de domaine
// ====================
export function normalizeDomain(siteUrl?: string): string {
  if (!siteUrl) return "";
  return siteUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

// ====================
// ✅ Méthode principale
// ====================
export async function fetchValidBrandLogo(
  brand?: string,
  siteUrl?: string,
): Promise<string> {
  if (!brand) return FALLBACK_BRAND_PLACEHOLDER;

  const safeBrand = brand.toLowerCase().trim();

  const cacheKey = `${safeBrand}|${siteUrl ?? ""}`;
  if (brandLogoCache.has(cacheKey)) return brandLogoCache.get(cacheKey)!;

  const normalizedBrand = brand.toLowerCase().trim();
  const domain =
    siteUrl
      ?.replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0] || `${normalizedBrand}.com`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/logo?domain=${domain}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) throw new Error("Logo not found");

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    brandLogoCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    // 🔁 Fallback favicon Google
    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    brandLogoCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  }
}

// ====================
// ✅ Accès direct (synchrone)
// ====================
export function getBrandLogo(brand?: string, siteUrl?: string): string {
  // ✅ sécurité totale
  if (!brand || typeof brand !== "string") {
    return FALLBACK_BRAND_PLACEHOLDER;
  }

  const key = brand.toLowerCase().trim();

  if (!key) return FALLBACK_BRAND_PLACEHOLDER;

  const domain = siteUrl ? normalizeDomain(siteUrl) : `${key}.com`;

  return `${API_BASE_URL}/api/logo?domain=${domain}`;
}

/**
 * Returns the correct URL for a public asset.
 * Works in local dev (base "/") and GitHub Pages (base "/luma-v2/").
 */
export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

export const FALLBACK_GAME_IMAGE = "/images/browse-game.png";

const LOCAL_IMAGE_PREFIX = "/images/";

function normalizeImageSrc(src: string): string {
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }
  return `/${src.replace(/^\/+/, "")}`;
}

/** Paths allowed by next.config images.localPatterns and remotePatterns. */
export function isAllowedImageSrc(src: string): boolean {
  if (src.startsWith("https://") || src.startsWith("http://")) {
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  }
  return src.startsWith(LOCAL_IMAGE_PREFIX);
}

/** Ensures next/image receives a valid, allowed public or remote URL. */
export function resolveImageSrc(
  src: string | null | undefined,
  fallback = FALLBACK_GAME_IMAGE,
): string {
  const value = src?.trim();
  if (!value) return fallback;

  const normalized = normalizeImageSrc(value);
  return isAllowedImageSrc(normalized) ? normalized : fallback;
}

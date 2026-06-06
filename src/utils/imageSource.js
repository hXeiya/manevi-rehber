/** Wikimedia, anlamlı User-Agent olmadan görseli engelleyebilir */
export const IMAGE_HEADERS = {
  'User-Agent': 'ManeviRehber/1.0 (Educational culture app; React Native Expo)',
  Accept: 'image/*',
};

/** Çok büyük thumb URL'lerini mobil için küçültür */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  return url
    .replace(/\/\d+px-/g, '/800px-')
    .replace(/\/3840px-/g, '/800px-')
    .replace(/\/1920px-/g, '/800px-')
    .replace(/\/1280px-/g, '/800px-');
}

export function remoteImageSource(url) {
  if (!url) return null;
  if (typeof url !== 'string') {
    // Yerel require() kaydı (sayı veya asset objesi), doğrudan döndür
    return url;
  }
  const uri = normalizeImageUrl(url);
  if (!uri) return null;
  return {
    uri,
    headers: IMAGE_HEADERS,
  };
}

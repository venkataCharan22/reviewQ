export function buildReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export function isPlausiblePlaceId(value: string): boolean {
  const v = value.trim();
  return v.length >= 10 && v.length <= 256 && /^[A-Za-z0-9_-]+$/.test(v);
}

// Extract a YouTube video ID from common URL formats and build an embed URL.
// Supports: watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID, and a bare ID.

export function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Bare 11-char video id
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/, // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // /shorts/ID
    /\/live\/([a-zA-Z0-9_-]{11})/, // /live/ID
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

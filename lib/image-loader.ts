export default function customImageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Jika image dari /uploads/, langsung return tanpa optimization
  if (src.startsWith('/uploads/')) {
    return src;
  }

  // Jika Google user avatar
  if (src.includes('googleusercontent.com')) {
    return src;
  }

  // Default Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}

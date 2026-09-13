import type { MetadataRoute } from 'next';

const siteUrl = 'https://mzmznasipadang.github.io/VicPortfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/privacy/', '/terms/'].map((path) => ({ url: `${siteUrl}${path}` }));
}

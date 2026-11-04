import type { MetadataRoute } from 'next';

const siteUrl = 'https://victorch.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/privacy.html', '/terms.html'].map((path) => ({ url: `${siteUrl}${path}` }));
}

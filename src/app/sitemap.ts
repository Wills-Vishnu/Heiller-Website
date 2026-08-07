import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * In-page anchors are deliberately NOT listed: fragment URLs are not separate
 * documents and submitting them dilutes rather than improves indexing.
 *
 * `/security` and `/about` are real routes with their own canonical URLs and
 * metadata, so they do belong here. Priority is below the landing page but
 * meaningful — `/security` in particular is a page people find through search
 * during vendor diligence rather than by browsing the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/security`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}

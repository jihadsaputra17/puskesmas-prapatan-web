import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Halangi bot dari mengindeks halaman internal/rahasia jika ada
      disallow: ['/admin/', '/api/', '/private/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
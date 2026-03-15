import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti dengan URL domain asli Anda saat naik ke tahap Production
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Daftar halaman statis
  const routes = ['', '/layanan', '/jadwal-dokter', '/tentang-kami', '/kontak'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8, // Halaman beranda prioritas tertinggi
  }));

  /* 
    Jika Anda memiliki halaman dinamis dari database (misal: Berita), 
    Anda bisa mem-fetch datanya di sini dan menggabungkannya ke dalam array routes.
    Contoh:
    const beritaRoutes = beritaData.map(post => ({ url: `${baseUrl}/berita/${post.slug}`... }))
  */

  return [...routes];
}
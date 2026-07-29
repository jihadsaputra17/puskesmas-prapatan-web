/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan semua domain gambar dengan protokol HTTPS
      },
    ],
  },
};

export default nextConfig;
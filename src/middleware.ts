import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Hanya terapkan CSP dan header keamanan lainnya di lingkungan produksi
  if (process.env.NODE_ENV === 'production') {
    // Atur Content Security Policy (CSP)
    // Kebijakan ini membantu mencegah serangan XSS.
    // 'self' mengizinkan sumber daya dari origin yang sama.
    // 'unsafe-inline' untuk style diperlukan jika Anda menggunakan style inline, namun sebaiknya dihindari.
    // 'nonce-${nonce}' memungkinkan eksekusi skrip inline yang memiliki atribut nonce yang cocok.
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-src https://www.google.com;
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `;

    requestHeaders.set(
      'Content-Security-Policy',
      // Ganti newline dan spasi berlebih
      cspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    // Atur header keamanan lainnya
    requestHeaders.set('Referrer-Policy', 'origin-when-cross-origin');
    requestHeaders.set('X-Content-Type-Options', 'nosniff');
    requestHeaders.set('X-DNS-Prefetch-Control', 'on');
    requestHeaders.set('X-Frame-Options', 'DENY'); // Mencegah clickjacking
    requestHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // HSTS
  }

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path request kecuali untuk file statis internal Next.js.
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

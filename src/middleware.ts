import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Terapkan CSP dan header keamanan lainnya di lingkungan produksi
  if (process.env.NODE_ENV === "production") {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' https: blob: data:;
      font-src 'self' data:;
      connect-src 'self' https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-src 'self' https://www.google.com https://drive.google.com https://docs.google.com https://*.googleusercontent.com;
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `;

    requestHeaders.set(
      "Content-Security-Policy",
      cspHeader.replace(/\s{2,}/g, " ").trim(),
    );

    requestHeaders.set("Referrer-Policy", "origin-when-cross-origin");
    requestHeaders.set("X-Content-Type-Options", "nosniff");
    requestHeaders.set("X-DNS-Prefetch-Control", "on");
    requestHeaders.set("X-Frame-Options", "DENY");
    requestHeaders.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
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
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

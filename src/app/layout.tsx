import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Puskesmas Prapatan",
    template: "%s | Puskesmas Prapatan",
  },
  description: "Website resmi Puskesmas Prapatan, melayani kesehatan masyarakat Kota Balikpapan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <a className="skip-link" href="#main-content">Lewati ke isi utama</a>
        <SiteHeader isAdmin={false} />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <SiteFooter settings={{}} />
      </body>
    </html>
  );
}
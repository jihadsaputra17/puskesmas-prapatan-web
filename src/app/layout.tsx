import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSettings } from "@/lib/settings-actions";
import { getPpidItems } from "@/lib/ppid-actions";
import { getStandarPelayananItems } from "@/lib/standar-pelayanan-actions";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.site_name || "Puskesmas Prapatan";
  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description:
      settings.hero_subtitle ||
      "Website resmi Puskesmas Prapatan, melayani kesehatan masyarakat Kota Balikpapan.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, settings, ppidItems, standarPelayananItems] = await Promise.all([
    getServerSession(authOptions),
    getSettings(),
    getPpidItems({ limit: 15 }),
    getStandarPelayananItems({ limit: 15 }),
  ]);
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";
  const ppidLinks = ppidItems.map((item) => ({
    title: item.title,
    slug: item.slug,
    category: item.category,
  }));
  const standarPelayananLinks = standarPelayananItems.map((item) => ({
    title: item.title,
    slug: item.slug,
    category: item.category,
  }));

  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans flex min-h-screen flex-col antialiased`}>
        <a className="skip-link" href="#main-content">
          Lewati ke isi utama
        </a>
        <SiteHeader
          isAdmin={isAdmin}
          siteName={settings.site_name || "Puskesmas Prapatan"}
          ppidLinks={ppidLinks}
          standarPelayananLinks={standarPelayananLinks}
        />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}

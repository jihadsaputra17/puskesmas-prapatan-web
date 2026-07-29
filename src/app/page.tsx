import HeroSection from "@/components/layout/HeroSection";
import LayananSection from "@/components/layout/LayananSection";
import BeritaSection from "@/components/layout/BeritaSection";
import FaqSection from "@/components/layout/FaqSection";
import LayananSkeleton from "@/components/layout/LayananSkeleton";
import BeritaSkeleton from "@/components/layout/BeritaSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Beranda | Puskesmas Prapatan",
  description: "Puskesmas Prapatan berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<LayananSkeleton />}>
        <LayananSection />
      </Suspense>
      <Suspense fallback={<BeritaSkeleton />}>
        <BeritaSection />
      </Suspense>
      <FaqSection />
    </main>
  );
}
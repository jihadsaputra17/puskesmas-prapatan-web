import HeroSlideshow from "@/components/layout/HeroSlideshow";
import QuickAccess from "@/components/layout/QuickAccess";
import LayananSection from "@/components/layout/LayananSection";
import DokterSection from "@/components/layout/DokterSection";
import BeritaSection from "@/components/layout/BeritaSection";
import FaqSection from "@/components/layout/FaqSection";
import LayananSkeleton from "@/components/layout/LayananSkeleton";
import DokterSkeleton from "@/components/layout/DokterSkeleton";
import BeritaSkeleton from "@/components/layout/BeritaSkeleton";

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Informasi layanan, jadwal dokter, dan pengaduan Puskesmas Prapatan.",
};

export default async function HomePage() {
  return (
    <>
      <HeroSlideshow />
      <QuickAccess />
      <Suspense fallback={<LayananSkeleton />}>
        <LayananSection />
      </Suspense>
      <Suspense fallback={<DokterSkeleton />}>
        <DokterSection />
      </Suspense>
      <Suspense fallback={<BeritaSkeleton />}>
        <BeritaSection />
      </Suspense>
      <FaqSection />
    </>
  );
}

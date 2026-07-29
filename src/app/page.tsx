import type { Metadata } from "next";
import { Suspense } from "react";
import { getSettings } from "@/lib/settings-actions";
import ClinicHero from "@/components/layout/ClinicHero";
import QuickAccess from "@/components/layout/QuickAccess";
import LayananSection from "@/components/layout/LayananSection";
import BeritaSection from "@/components/layout/BeritaSection";
import FaqSection from "@/components/layout/FaqSection";
import LayananSkeleton from "@/components/layout/LayananSkeleton";
import BeritaSkeleton from "@/components/layout/BeritaSkeleton";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Informasi layanan, jadwal dokter, dan pengaduan Puskesmas Prapatan.",
};

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <ClinicHero settings={settings} />
      <QuickAccess />
      <Suspense fallback={<LayananSkeleton />}>
        <LayananSection />
      </Suspense>
      <Suspense fallback={<BeritaSkeleton />}>
        <BeritaSection />
      </Suspense>
      <FaqSection />
    </>
  );
}

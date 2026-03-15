import HeroSection from "../components/layout/HeroSection";
import LayananSection from "../components/layout/LayananSection";
import BeritaSection from "../components/layout/BeritaSection";
import FaqSection from "../components/layout/FaqSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda | Puskesmas Prapatan",
  description: "Puskesmas Prapatan berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <LayananSection />
      <BeritaSection />
      <FaqSection />
    </main>
  );
}
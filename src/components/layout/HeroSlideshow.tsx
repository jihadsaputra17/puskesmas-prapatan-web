"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Slide = {
  image: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600&q=80",
    title: "Pelayanan Kesehatan untuk Masyarakat",
    subtitle:
      "Puskesmas Prapatan berkomitmen memberikan layanan kesehatan prima, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
    ctaLabel: "Lihat layanan",
    ctaHref: "/layanan",
  },
  {
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80",
    title: "Layanan Poli Spesialis",
    subtitle:
      "Konsultasi kesehatan dengan tenaga medis profesional di berbagai poli spesialis yang tersedia.",
    ctaLabel: "Jadwal dokter",
    ctaHref: "/jadwal-dokter",
  },
  {
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80",
    title: "Kesehatan Ibu & Anak",
    subtitle:
      "Layanan lengkap mulai dari pemeriksaan kehamilan, imunisasi, hingga tumbuh kembang balita.",
    ctaLabel: "Info selengkapnya",
    ctaHref: "/layanan",
  },
];

export default function HeroSlideshow() {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-slideshow"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative flex min-h-[60vh] items-center bg-navy md:min-h-[75vh]"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(7,28,43,0.85) 0%, rgba(11,42,63,0.7) 50%, rgba(7,28,43,0.55) 100%), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="content-container relative z-10 w-full py-16 md:py-24">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                    {slide.subtitle}
                  </p>
                  {slide.ctaLabel && slide.ctaHref && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href={slide.ctaHref} className="button-primary">
                        {slide.ctaLabel}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

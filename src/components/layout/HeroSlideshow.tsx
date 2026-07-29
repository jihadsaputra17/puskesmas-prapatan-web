"use client";

import { useRef } from "react";
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
    image: "/images/hero-1.jpg",
    title: "Pelayanan Kesehatan untuk Masyarakat",
    subtitle:
      "Puskesmas Prapatan berkomitmen memberikan layanan kesehatan prima, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
    ctaLabel: "Lihat layanan",
    ctaHref: "/layanan",
  },
  {
    image: "/images/hero-2.jpg",
    title: "Layanan Poli Spesialis",
    subtitle:
      "Konsultasi kesehatan dengan tenaga medis profesional di berbagai poli spesialis yang tersedia.",
    ctaLabel: "Jadwal dokter",
    ctaHref: "/jadwal-dokter",
  },
  {
    image: "/images/hero-3.jpg",
    title: "Fasilitas & Lingkungan Puskesmas",
    subtitle:
      "Nikmati pelayanan kesehatan yang nyaman di Puskesmas Prapatan dengan fasilitas yang terus ditingkatkan.",
    ctaLabel: "Profil puskesmas",
    ctaHref: "/profil",
  },
  {
    image: "/images/hero-4.jpg",
    title: "Tenaga Medis Profesional",
    subtitle:
      "Dilayani oleh tenaga kesehatan yang berpengalaman dan siap memberikan pelayanan terbaik bagi Anda dan keluarga.",
    ctaLabel: "Lihat layanan",
    ctaHref: "/layanan",
  },
  {
    image: "/images/hero-5.jpg",
    title: "Layanan Unggulan Puskesmas",
    subtitle:
      "Berbagai layanan unggulan tersedia, mulai dari pemeriksaan umum, gigi, KIA, hingga laboratorium sederhana.",
    ctaLabel: "Lihat layanan",
    ctaHref: "/layanan",
  },
  {
    image: "/images/hero-6.jpg",
    title: "Kenyamanan & Keamanan Pasien",
    subtitle:
      "Puskesmas Prapatan mengutamakan kenyamanan dan keselamatan pasien dalam setiap pelayanan yang diberikan.",
    ctaLabel: "Info selengkapnya",
    ctaHref: "/profil",
  },
];

export default function HeroSlideshow() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation = {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          };
          swiper.navigation.init();
          swiper.navigation.update();
        }}
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

        {/* Custom navigation buttons — refs, not state, so Swiper gets them on init */}
        <button
          ref={prevRef}
          className="swiper-button-prev flex items-center justify-center after:!hidden z-10"
          aria-label="Previous slide"
        >
          <svg className="!w-6 !h-6 text-navy hover:text-clinic-teal transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
        <button
          ref={nextRef}
          className="swiper-button-next flex items-center justify-center after:!hidden z-10"
          aria-label="Next slide"
        >
          <svg className="!w-6 !h-6 text-navy hover:text-clinic-teal transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
      </Swiper>
    </section>
  );
}

import Image from "next/image";

export default function DefaultCoverBanner({
  title,
  badge = "UPTD Puskesmas Prapatan",
  subtitle = "Kota Balikpapan · Kalimantan Timur",
  variant = "card",
}: {
  title: string;
  badge?: string;
  subtitle?: string;
  variant?: "hero" | "card" | "compact";
}) {
  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#071c2b] via-[#0b2a3f] to-[#0f766e] select-none">
      {/* Subtle background building photo with low opacity */}
      <Image
        src="/images/hero-pkm.jpg"
        alt=""
        fill
        className="object-cover opacity-20 mix-blend-luminosity"
        sizes={isHero ? "(max-width: 896px) 100vw, 896px" : "(max-width: 768px) 100vw, 33vw"}
      />

      {/* Decorative glowing orbs & pattern */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-teal-400/20 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="pkm-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkm-grid)" />
      </svg>

      {/* Content */}
      <div
        className={`relative z-10 flex h-full w-full flex-col justify-between ${
          isHero ? "p-6 sm:p-10 md:p-12" : isCompact ? "p-3.5" : "p-5"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95 p-1 shadow-md ${
                isHero ? "h-10 w-10 sm:h-11 sm:w-11" : isCompact ? "h-7 w-7" : "h-8 w-8"
              }`}
            >
              <Image
                src="/images/logo-pkm.png"
                alt=""
                fill
                className="object-contain p-0.5"
                sizes="44px"
              />
            </span>
            <div className="min-w-0">
              <p
                className={`truncate font-bold tracking-wide text-teal-200 uppercase ${
                  isHero ? "text-xs sm:text-sm" : "text-[0.65rem]"
                }`}
              >
                {badge}
              </p>
              {!isCompact && (
                <p
                  className={`truncate text-slate-300 ${
                    isHero ? "text-xs" : "text-[0.625rem]"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="my-auto pt-2">
          <p
            className={`font-extrabold tracking-tight text-white drop-shadow-sm ${
              isHero
                ? "line-clamp-3 text-xl sm:text-2xl md:text-3xl leading-snug"
                : isCompact
                  ? "line-clamp-2 text-xs leading-snug"
                  : "line-clamp-2 text-base leading-snug"
            }`}
          >
            {title}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/15 pt-2.5 text-[0.6875rem] font-medium text-teal-100/90">
          <span>UPTD Puskesmas Prapatan</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.625rem] font-semibold text-white backdrop-blur-sm">
            Informasi Resmi
          </span>
        </div>
      </div>
    </div>
  );
}

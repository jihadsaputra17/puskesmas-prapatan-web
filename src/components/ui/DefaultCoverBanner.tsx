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
    <div
      className="
        absolute inset-0 h-full w-full overflow-hidden select-none
      "
      style={{
        background:
          "linear-gradient(135deg, #071c2b 0%, #0b2a3f 52%, #0f766e 100%)",
      }}
    >
      {/* Subtle background building photo */}
      <Image
        src="/images/hero-pkm.jpg"
        alt=""
        fill
        className="object-cover opacity-25 mix-blend-luminosity"
        sizes={isHero ? "(max-width: 896px) 100vw, 896px" : "(max-width: 768px) 100vw, 33vw"}
      />

      {/* Dark gradient overlay to ensure crisp white text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(7,28,43,0.82) 0%, rgba(11,42,63,0.72) 55%, rgba(15,118,110,0.78) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative grid pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="pkm-cover-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkm-cover-grid)" />
      </svg>

      {/* Content */}
      <div
        className={`relative z-10 flex h-full w-full flex-col justify-between text-white ${
          isHero ? "p-6 sm:p-10 md:p-12" : isCompact ? "p-3.5" : "p-5"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-md ${
                isHero ? "h-10 w-10 sm:h-12 sm:w-12" : isCompact ? "h-7 w-7" : "h-9 w-9"
              }`}
            >
              <Image
                src="/images/logo-pkm.png"
                alt=""
                fill
                className="object-contain p-0.5"
                sizes="48px"
              />
            </span>
            <div className="min-w-0">
              <p
                className={`truncate font-bold uppercase tracking-wider text-teal-200 ${
                  isHero ? "text-xs sm:text-sm" : "text-[0.6875rem]"
                }`}
              >
                {badge}
              </p>
              {!isCompact && (
                <p
                  className={`truncate text-slate-200/90 ${
                    isHero ? "text-xs sm:text-sm" : "text-[0.65rem]"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="my-auto py-2">
          <p
            className={`font-extrabold tracking-tight text-white drop-shadow ${
              isHero
                ? "line-clamp-3 text-xl sm:text-3xl md:text-4xl leading-tight"
                : isCompact
                  ? "line-clamp-2 text-xs leading-snug"
                  : "line-clamp-2 text-base leading-snug"
            }`}
          >
            {title || "Informasi Resmi UPTD Puskesmas Prapatan"}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-2.5 text-[0.6875rem] font-medium text-teal-100">
          <span>UPTD Puskesmas Prapatan · Kota Balikpapan</span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[0.625rem] font-semibold text-white">
            Informasi Resmi
          </span>
        </div>
      </div>
    </div>
  );
}

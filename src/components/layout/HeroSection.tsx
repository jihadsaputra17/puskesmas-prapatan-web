import Link from 'next/link';

const HeroSection = () => {
  return (
    <section 
      className="relative bg-slate-50 py-16 sm:py-24 lg:py-32" 
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          id="hero-heading" 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
        >
          Puskesmas Prapatan
          <span className="block text-teal-600 text-2xl sm:text-3xl lg:text-4xl mt-2 font-bold">
            Pelayanan Kesehatan Prima untuk Masyarakat
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-8">
          Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/layanan" 
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 shadow-sm"
          >
            Lihat Layanan Kami
          </Link>
          {/* Tombol Panggilan Darurat ditonjolkan secara visual dan aksesibilitasnya */}
          <Link 
            href="/kontak" 
            className="inline-flex justify-center items-center px-6 py-3 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 shadow-sm"
            aria-label="Hubungi layanan darurat atau kontak kami"
          >
            Panggilan Darurat / Kontak
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
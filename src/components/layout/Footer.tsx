import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Puskesmas */}
          <div>
            <h3 className="text-lg font-semibold text-teal-400">Puskesmas Prapatan</h3>
            <p className="mt-2 text-gray-300">
              Jl. Prapatan Dalam No. 6, Prapatan, <br />
              Kec. Balikpapan Kota, Kota Balikpapan, <br />
              Kalimantan Timur 76111
            </p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="text-lg font-semibold text-teal-400">Tautan Cepat</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/layanan" className="text-gray-300 hover:text-teal-400 focus:outline-none focus:underline">Layanan</Link></li>
              <li><Link href="/jadwal-dokter" className="text-gray-300 hover:text-teal-400 focus:outline-none focus:underline">Jadwal Dokter</Link></li>
              <li><Link href="/pengaduan" className="text-gray-300 hover:text-teal-400 focus:outline-none focus:underline">Pengaduan & Kontak</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-gray-300 hover:text-teal-400 focus:outline-none focus:underline">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-teal-400">Kontak</h3>
            <p className="mt-2 text-gray-300">
              Email: <a href="mailto:info@puskesmasprapatan.go.id" className="hover:text-teal-400 focus:outline-none focus:underline">info@puskesmasprapatan.go.id</a>
            </p>
            <p className="mt-1 text-gray-300">
              Telepon: <a href="tel:+62542123456" className="hover:text-teal-400 focus:outline-none focus:underline">(0542) 123-456</a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; {currentYear} Puskesmas Prapatan Kota Balikpapan. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

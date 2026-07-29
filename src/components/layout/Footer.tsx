import Link from "next/link";
import { getSettings } from "@/lib/settings-actions";

export default async function Footer() {
  // Ambil data pengaturan dari database
  const settings = await getSettings();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Tentang */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">{settings.site_name || 'Puskesmas Prapatan'}</h3>
            <p className="text-sm leading-relaxed pr-8">{settings.hero_subtitle || 'Komitmen kami adalah memberikan pelayanan kesehatan terbaik untuk masyarakat.'}</p>
          </div>
          
          {/* Kolom 2: Kontak */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3"><span className="mt-1">📍</span><span>{settings.address || 'Alamat belum diatur.'}</span></li>
              <li className="flex items-start gap-3"><span className="mt-1">📞</span><a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone || 'Telepon belum diatur.'}</a></li>
              <li className="flex items-start gap-3"><span className="mt-1">✉️</span><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email || 'Email belum diatur.'}</a></li>
            </ul>
          </div>

          {/* Kolom 3: Tautan & Sosial Media */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Tautan Terkait</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/layanan" className="hover:text-white">Layanan & Fasilitas</Link></li>
              <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-white">Kebijakan Privasi</Link></li>
            </ul>
            <div className="flex space-x-4 mt-6">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">Instagram</a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">Facebook</a>}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.site_name || 'Puskesmas Prapatan'}. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
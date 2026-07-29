import Link from "next/link";

const items = [
  { href: "/layanan", title: "Layanan kesehatan", text: "Lihat informasi poli dan layanan yang tersedia." },
  { href: "/jadwal-dokter", title: "Jadwal dokter", text: "Cari jadwal tenaga medis berdasarkan poli." },
  { href: "/pengaduan", title: "Sampaikan pengaduan", text: "Kirim masukan atau kendala pelayanan dengan aman." },
];

export default function QuickAccess() {
  return <section className="bg-white py-10"><div className="content-container"><h2 className="sr-only">Akses cepat</h2><ul className="grid gap-4 md:grid-cols-3">{items.map((item) => <li key={item.href}><Link href={item.href} className="block min-h-36 rounded-xl border border-slate-200 p-5 transition hover:border-teal-600 hover:shadow-sm"><h3 className="font-bold text-[#12304a]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p><span className="mt-4 block text-sm font-semibold text-[#007f7b]">Buka informasi</span></Link></li>)}</ul></div></section>;
}

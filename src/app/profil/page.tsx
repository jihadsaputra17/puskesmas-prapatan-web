import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil UPTD Puskesmas Prapatan Balikpapan — informasi, layanan, jam pelayanan, dan kontak.",
};

const services = [
  "Pemeriksaan Umum (Dewasa & Anak)",
  "Kesehatan Ibu dan Anak (KIA) & KB",
  "Pelayanan Gigi dan Mulut",
  "Imunisasi",
  "Gizi dan Sanitasi",
  "Laboratorium Sederhana",
  "Farmasi / Apotek",
  "Konsultasi Kesehatan",
  "Pelayanan Rujukan BPJS Kesehatan",
  "Posyandu & Kesehatan Masyarakat",
];

const programs = [
  {
    name: "Madu Kendi",
    desc: "Masyarakat Peduli Deteksi Dini — program deteksi dini sebagai upaya pencegahan dan pengendalian penyakit tidak menular di masyarakat.",
  },
  {
    name: "Gardu",
    desc: "Gerakan Anti Karies di Posyandu — kegiatan pemeriksaan gigi karies pada anak di pos pelayanan terpadu (posyandu).",
  },
  {
    name: "Proteks Sehat",
    desc: "Program Terpadu Kantin Sekolah Sehat — memastikan kantin sekolah memenuhi standar higiene dan sanitasi pangan yang aman bagi siswa.",
  },
];

export default function ProfilPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--navy-deep)] via-navy to-[var(--teal)] py-14 md:py-20">
        <div className="content-container text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            UPTD Puskesmas Prapatan
          </h1>
          <p className="mt-2 text-lg text-slate-200/90">
            Kota Balikpapan, Kalimantan Timur
          </p>
          <span className="mt-4 inline-block rounded-full bg-[var(--teal-soft)] px-5 py-1.5 text-sm font-semibold text-[var(--teal)]">
            Status Akreditasi: PARIPURNA
          </span>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container max-w-4xl space-y-10">
          {/* Tentang Kami */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Tentang Kami
            </h2>
          </div>
          <p className="leading-7 text-slate-600">
            UPTD Puskesmas Prapatan adalah fasilitas pelayanan kesehatan tingkat pertama milik
            Pemerintah Kota Balikpapan yang berlokasi di Kelurahan Prapatan, Kecamatan Balikpapan
            Kota. Puskesmas Prapatan berkomitmen memberikan pelayanan kesehatan dasar yang bermutu,
            terjangkau, dan merata bagi masyarakat di wilayah kerjanya, mencakup pelayanan promotif,
            preventif, kuratif, dan rehabilitatif, baik untuk pasien umum maupun peserta BPJS
            Kesehatan.
          </p>

          {/* Informasi & Kontak */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Informasi &amp; Kontak
            </h2>
          </div>
          <div className="grid gap-5 rounded-panel bg-[var(--teal-soft)] p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
                Alamat
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Jl. Prapatan RT.29 No.31, Kelurahan Prapatan, Kecamatan Balikpapan Kota, Kota
                Balikpapan, Kalimantan Timur 76111
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
                Telepon
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">(0542) 426008</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
                Status Akreditasi
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-navy">PARIPURNA</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
                Instagram
              </p>
              <a
                href="https://www.instagram.com/puskesmas.prapatan/"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm font-medium leading-6 text-[var(--teal)] hover:text-navy"
              >
                @puskesmas.prapatan
              </a>
            </div>
          </div>

          {/* Jam Pelayanan */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Jam Pelayanan Loket
            </h2>
          </div>
          <div className="overflow-hidden rounded-panel border border-slate-200/90 bg-white shadow-[var(--shadow-soft)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--teal-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
                  <th className="px-5 py-3">Hari</th>
                  <th className="px-5 py-3">Jam Pelayanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Senin – Kamis", "08.00 – 12.00 WITA"],
                  ["Jumat", "08.00 – 10.00 WITA"],
                  ["Sabtu", "08.00 – 11.30 WITA"],
                ].map(([hari, jam]) => (
                  <tr key={hari} className="text-slate-700 even:bg-[var(--teal-soft)]/40">
                    <td className="px-5 py-3 font-medium">{hari}</td>
                    <td className="px-5 py-3">{jam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Pendaftaran pasien BPJS Kesehatan juga dapat dilakukan secara online. Silakan hubungi
            loket pendaftaran atau kanal media sosial resmi Puskesmas untuk panduan lengkap.
          </p>

          {/* Program Unggulan */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Program Unggulan
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.name}
                className="panel flex flex-col border-l-4 border-l-[var(--teal)] p-5"
              >
                <h3 className="text-base font-bold tracking-tight text-navy">{p.name}</h3>
                <p className="mt-2 flex-grow text-sm leading-6 text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Jenis Layanan */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Jenis Layanan
            </h2>
          </div>
          <ul className="columns-1 gap-x-6 gap-y-2 sm:columns-2">
            {services.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 py-1 text-sm leading-6 text-slate-700 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--teal)]"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="rounded-panel border border-dashed border-teal-300/60 bg-[var(--teal-soft)]/60 px-5 py-4 text-sm leading-6 text-slate-600">
            Catatan: daftar layanan di atas merupakan cakupan umum layanan Puskesmas. Mohon
            sesuaikan atau lengkapi dengan daftar layanan resmi yang berlaku saat ini di Puskesmas
            Prapatan.
          </div>

          {/* Hubungi Kami CTA */}
          <div className="rounded-panel bg-gradient-to-br from-navy to-[var(--navy-deep)] p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Hubungi Kami</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200/90">
              Jl. Prapatan RT.29 No.31, Kelurahan Prapatan, Balikpapan Kota, Balikpapan
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200/90">
              Telp: (0542) 426008 &nbsp;|&nbsp; Instagram:{" "}
              <a
                href="https://www.instagram.com/puskesmas.prapatan/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-200 hover:text-white hover:underline"
              >
                @puskesmas.prapatan
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

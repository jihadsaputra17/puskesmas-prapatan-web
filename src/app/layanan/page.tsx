import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Daftar layanan kesehatan di UPTD Puskesmas Prapatan — poli umum, gigi, KIA, laboratorium, farmasi, dan program kesehatan masyarakat.",
};

const services = [
  {
    emoji: "🩺",
    title: "Poli Umum",
    desc: "Pemeriksaan kesehatan umum bagi dewasa, diagnosis, pengobatan, serta rujukan bila diperlukan penanganan lebih lanjut.",
    items: [
      "Pemeriksaan kesehatan & konsultasi",
      "Surat keterangan sehat",
      "Pengobatan penyakit umum",
      "Pemeriksaan tensi, asam urat, kolesterol",
    ],
  },
  {
    emoji: "🦷",
    title: "Poli Gigi & Mulut",
    desc: "Pemeriksaan dan perawatan kesehatan gigi serta mulut untuk seluruh kelompok usia.",
    items: [
      "Pemeriksaan gigi",
      "Pencabutan gigi",
      "Penambalan gigi",
      "Edukasi kesehatan gigi (termasuk program Gardu)",
    ],
  },
  {
    emoji: "🤰",
    title: "KIA & KB (Kesehatan Ibu, Anak & Keluarga Berencana)",
    desc: "Pelayanan kesehatan ibu hamil, bersalin, nifas, serta layanan keluarga berencana.",
    items: [
      "Pemeriksaan kehamilan (ANC)",
      "Tes kehamilan",
      "Pelayanan KB",
      "Pelayanan persalinan*",
    ],
  },
  {
    emoji: "👶",
    title: "Poli Anak / MTBS",
    desc: "Pemeriksaan tumbuh kembang dan kesehatan anak, termasuk imunisasi dasar.",
    items: [
      "Pemeriksaan anak sakit (MTBS)",
      "Imunisasi",
      "Pemantauan tumbuh kembang",
    ],
  },
  {
    emoji: "🥗",
    title: "Poli Gizi",
    desc: "Konsultasi gizi untuk balita, ibu hamil, dan masyarakat umum dalam rangka pencegahan masalah gizi termasuk stunting.",
    items: [
      "Konsultasi gizi",
      "Pemantauan status gizi balita",
      "Edukasi pola makan sehat",
    ],
  },
  {
    emoji: "💧",
    title: "Poli Sanitasi",
    desc: "Konseling dan penyuluhan terkait kesehatan lingkungan serta penyakit berbasis lingkungan.",
    items: [
      "Konseling kesehatan lingkungan",
      "Pengawasan sanitasi (termasuk program Proteks Sehat)",
    ],
  },
  {
    emoji: "🚨",
    title: "Ruang Tindakan / Gawat Darurat",
    desc: "Penanganan kasus kegawatdaruratan ringan dan tindakan medis sederhana.",
    items: [
      "Jahit luka & lepas jahitan",
      "Ganti balutan",
      "Penanganan luka",
    ],
  },
  {
    emoji: "🧪",
    title: "Laboratorium",
    desc: "Pemeriksaan penunjang diagnosis sederhana untuk mendukung pengobatan pasien.",
    items: [
      "Tes golongan darah",
      "Gula darah, asam urat, kolesterol",
      "Tes kehamilan",
      "Tes HIV (program Teh Poci)*",
    ],
  },
  {
    emoji: "💊",
    title: "Farmasi",
    desc: "Penyediaan dan penyerahan obat sesuai resep dokter bagi seluruh pasien Puskesmas.",
    items: [
      "Penyerahan obat sesuai resep",
      "Edukasi penggunaan obat",
    ],
  },
];

const filterTags = [
  "Poli Umum",
  "Poli Gigi",
  "KIA & KB",
  "MTBS / Anak",
  "Gizi",
  "Sanitasi",
  "Tindakan / UGD",
  "Laboratorium",
  "Farmasi",
];

const programs = [
  {
    name: "Madu Kendi",
    desc: "Masyarakat Peduli Deteksi Dini — deteksi dini penyakit tidak menular.",
  },
  {
    name: "Gardu",
    desc: "Gerakan Anti Karies di Posyandu — pemeriksaan gigi karies pada anak.",
  },
  {
    name: "Proteks Sehat",
    desc: "Program Terpadu Kantin Sekolah Sehat — sanitasi pangan di lingkungan sekolah.",
  },
  {
    name: "Gerakan Simpatik",
    desc: "Sigap Menumpas Jentik — pemberantasan sarang nyamuk dengan gerakan 3M Plus.",
  },
  {
    name: "Teh Poci",
    desc: "Test HIV Populasi Kunci — pemeriksaan HIV bagi kelompok populasi kunci.",
  },
];

export default function LayananPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--navy-deep)] via-navy to-[var(--teal)] py-14 md:py-20">
        <div className="content-container text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Layanan Kami
          </h1>
          <p className="mt-2 text-lg text-slate-200/90">
            UPTD Puskesmas Prapatan &mdash; Kota Balikpapan
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container max-w-5xl space-y-10">
          {/* Intro */}
          <p className="mx-auto max-w-2xl text-center text-base leading-7 text-slate-600">
            UPTD Puskesmas Prapatan menyediakan berbagai layanan kesehatan dasar bagi masyarakat,
            mulai dari pemeriksaan umum, kesehatan ibu dan anak, gigi dan mulut, hingga layanan
            penunjang seperti laboratorium dan farmasi. Seluruh layanan dapat diakses oleh pasien
            umum maupun peserta BPJS Kesehatan.
          </p>

          {/* Filter tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {filterTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--teal-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--teal)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Service cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className="panel panel-lift flex h-full flex-col p-5"
              >
                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal-soft)] text-xl"
                  aria-hidden="true"
                >
                  {s.emoji}
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.desc}</p>
                {s.items.length > 0 && (
                  <ul className="mt-3 flex-grow space-y-1.5">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-5 text-slate-600 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--teal)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {/* Footnote */}
          <p className="text-xs leading-5 text-slate-400">
            *Ketersediaan layanan tertentu (mis. persalinan, tes HIV) dapat menyesuaikan kapasitas
            dan jadwal petugas Puskesmas. Silakan konfirmasi ke loket pendaftaran untuk kepastian
            layanan.
          </p>

          {/* Program Kesehatan Masyarakat */}
          <div className="accent-bar">
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Program Kesehatan Masyarakat
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.name}
                className="rounded-panel border-l-4 border-l-[var(--teal)] bg-[var(--teal-soft)]/60 p-5"
              >
                <h3 className="text-base font-bold tracking-tight text-navy">{p.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="rounded-panel border border-dashed border-teal-300/60 bg-[var(--teal-soft)]/60 px-5 py-4 text-sm leading-6 text-slate-600">
            Catatan: Daftar layanan dan poli di atas disusun berdasarkan layanan umum yang lazim
            tersedia di Puskesmas serta informasi publik mengenai Puskesmas Prapatan. Mohon
            sesuaikan nama poli, jam praktik, serta nama tenaga medis dengan data resmi terbaru
            dari Puskesmas Prapatan sebelum dipublikasikan di website.
          </div>

          {/* CTA */}
          <div className="rounded-panel bg-gradient-to-br from-navy to-[var(--navy-deep)] p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Butuh Informasi Lebih Lanjut?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-200/90">
              Hubungi kami di (0542) 426008 atau kunjungi langsung sesuai jam pelayanan.
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200/90">
              Instagram:{" "}
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

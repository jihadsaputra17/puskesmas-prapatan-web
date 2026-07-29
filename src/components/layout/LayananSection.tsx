import Link from "next/link";
import SectionHeading from "./SectionHeading";

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
      "Edukasi kesehatan gigi",
    ],
  },
  {
    emoji: "🤰",
    title: "KIA & KB",
    desc: "Pelayanan kesehatan ibu hamil, bersalin, nifas, serta layanan keluarga berencana.",
    items: [
      "Pemeriksaan kehamilan (ANC)",
      "Tes kehamilan",
      "Pelayanan KB",
      "Pelayanan persalinan",
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
    desc: "Konsultasi gizi untuk balita, ibu hamil, dan masyarakat umum dalam rangka pencegahan masalah gizi.",
    items: [
      "Konsultasi gizi",
      "Pemantauan status gizi balita",
      "Edukasi pola makan sehat",
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
    ],
  },
];

export default function LayananSection() {
  return (
    <section className="section-band bg-white" id="layanan" aria-labelledby="layanan-heading">
      <div className="content-container">
        <SectionHeading
          id="layanan-heading"
          eyebrow="Pelayanan"
          title="Layanan poli"
          description="Ringkasan layanan kesehatan primer yang tersedia di Puskesmas Prapatan."
          action={
            <Link href="/layanan" className="button-secondary">
              Semua layanan
            </Link>
          }
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.title}>
              <Link
                href="/layanan"
                className="panel panel-lift flex h-full flex-col overflow-hidden p-5"
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-clinic-soft text-lg"
                  aria-hidden="true"
                >
                  {s.emoji}
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 flex-grow text-sm leading-6 text-slate-600 line-clamp-3">
                  {s.desc}
                </p>
                <span className="mt-4 text-sm font-semibold text-clinic-teal">
                  Lihat detail →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

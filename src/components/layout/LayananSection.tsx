import Link from "next/link";
import SectionHeading from "./SectionHeading";

const services = [
  {
    code: "01",
    category: "Layanan Medis",
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
    code: "02",
    category: "Kesehatan Gigi",
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
    code: "03",
    category: "Ibu & Keluarga",
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
    code: "04",
    category: "Kesehatan Anak",
    title: "Poli Anak / MTBS",
    desc: "Pemeriksaan tumbuh kembang dan kesehatan anak, termasuk imunisasi dasar.",
    items: [
      "Pemeriksaan anak sakit (MTBS)",
      "Imunisasi",
      "Pemantauan tumbuh kembang",
    ],
  },
  {
    code: "05",
    category: "Nutrisi & Dietetik",
    title: "Poli Gizi",
    desc: "Konsultasi gizi untuk balita, ibu hamil, dan masyarakat umum dalam rangka pencegahan masalah gizi.",
    items: [
      "Konsultasi gizi",
      "Pemantauan status gizi balita",
      "Edukasi pola makan sehat",
    ],
  },
  {
    code: "06",
    category: "Penunjang Diagnostik",
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

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.title}>
              <Link
                href="/layanan"
                className="group panel panel-lift flex h-full flex-col overflow-hidden border-t-4 border-t-[var(--teal)] p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--teal-soft)] text-xs font-extrabold tracking-wider text-[var(--teal)] transition-colors group-hover:bg-[var(--teal)] group-hover:text-white">
                    {s.code}
                  </span>
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {s.category}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-navy transition-colors group-hover:text-clinic-teal">
                  {s.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {s.desc}
                </p>

                <ul className="mt-4 flex-grow space-y-1.5 border-t border-slate-100 pt-3.5">
                  {s.items.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs leading-5 text-slate-600 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--teal)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="mt-5 inline-flex items-center text-sm font-semibold text-clinic-teal">
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

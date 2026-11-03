import { Metadata } from "next";
import Link from "next/link";
import StandarPelayananExplorer from "@/components/standar-pelayanan/StandarPelayananExplorer";
import {
  STANDAR_PELAYANAN_CATEGORY_META,
  getStandarPelayananItems,
} from "@/lib/standar-pelayanan-actions";
import type { StandarPelayananCategory } from "@/lib/admin-schemas";

export const metadata: Metadata = {
  title: "Standar Pelayanan — UPTD Puskesmas Prapatan",
  description:
    "Standar Pelayanan Publik UPTD Puskesmas Prapatan Kota Balikpapan — persyaratan, prosedur, jangka waktu penyelesaian, biaya/tarif, produk pelayanan, dan pengelolaan pengaduan.",
};

const componentsList = [
  {
    title: "Persyaratan & Prosedur Layanan",
    desc: "Kejelasan dokumen administrasi yang diperlukan serta tahapan alur pelayanan dari pendaftaran hingga selesai.",
  },
  {
    title: "Jangka Waktu & Biaya / Tarif",
    desc: "Kepastian estimasi waktu tunggu/penyelesaian layanan serta rincian tarif resmi sesuai Perda atau jaminan BPJS.",
  },
  {
    title: "Produk & Kompetensi Pelaksana",
    desc: "Standar mutu hasil pelayanan medis dan penunjang yang didukung oleh tenaga kesehatan profesional dan kompeten.",
  },
  {
    title: "Penanganan Pengaduan & Evaluasi",
    desc: "Tersedianya kanal pengaduan masyarakat yang responsif serta pelaksanaan Survei Kepuasan Masyarakat (SKM) berkala.",
  },
];

const categoryKeys: StandarPelayananCategory[] = [
  "standar-pelayanan",
  "maklumat-pelayanan",
  "sop-alur",
  "tarif-biaya",
  "survei-kepuasan",
  "kompensasi-pengaduan",
];

export default async function StandarPelayananPage() {
  const items = await getStandarPelayananItems({ limit: 60 });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--navy-deep)] via-navy to-[var(--teal)] py-14 md:py-20">
        <div className="content-container max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">
            Pelayanan Publik · UU No. 25 Tahun 2009
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Standar Pelayanan Puskesmas Prapatan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200/95 sm:text-lg">
            Tolok ukur yang dipergunakan sebagai pedoman penyelenggaraan pelayanan dan acuan
            penilaian kualitas pelayanan kesehatan yang berkualitas, cepat, mudah, terjangkau, dan
            terukur bagi masyarakat Kota Balikpapan.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container max-w-6xl space-y-14">
          {/* Tentang Standar Pelayanan */}
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
            <div className="panel p-6 sm:p-8">
              <div className="accent-bar">
                <p className="eyebrow">Pedoman Mutu Layanan</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy">
                  Apa itu Standar Pelayanan?
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Standar Pelayanan</strong> adalah tolok ukur yang dipergunakan sebagai
                pedoman penyelenggaraan pelayanan dan acuan penilaian kualitas pelayanan sebagai
                kewajiban dan janji penyelenggara kepada masyarakat dalam rangka pelayanan yang
                berkualitas, cepat, mudah, terjangkau, dan terukur.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Penyusunan Standar Pelayanan di UPTD Puskesmas Prapatan mengacu pada{" "}
                <strong>Undang-Undang Nomor 25 Tahun 2009</strong> tentang Pelayanan Publik serta{" "}
                <strong>PermenPAN-RB Nomor 15 Tahun 2014</strong> tentang Pedoman Standar Pelayanan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {componentsList.map((comp) => (
                <div
                  key={comp.title}
                  className="panel border-l-4 border-l-[var(--teal)] p-5"
                >
                  <h3 className="text-base font-bold tracking-tight text-navy">
                    {comp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Klasifikasi Standar Pelayanan */}
          <div>
            <div className="accent-bar mb-6">
              <p className="eyebrow">Komponen Service Delivery</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Komponen &amp; Kategori Standar Pelayanan
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryKeys.map((key) => {
                const meta = STANDAR_PELAYANAN_CATEGORY_META[key];
                return (
                  <div
                    key={key}
                    className="rounded-[var(--radius)] border border-teal-100 bg-[var(--teal-soft)]/55 p-5"
                  >
                    <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--teal)] shadow-sm">
                      {meta.shortLabel}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-navy">{meta.label}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                      {meta.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daftar Dokumen & Informasi Standar Pelayanan */}
          <div id="daftar-standar-pelayanan">
            <div className="accent-bar mb-6">
              <p className="eyebrow">Publikasi &amp; Dokumen Resmi</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Daftar Dokumen Standar Pelayanan
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Telusuri dokumen SK Standar Pelayanan, Maklumat Pelayanan, SOP, tarif retribusi, dan
                standar pelayanan tiap poli/unit di UPTD Puskesmas Prapatan.
              </p>
            </div>

            <StandarPelayananExplorer items={items} />
          </div>

          {/* CTA */}
          <div className="rounded-[var(--radius-lg)] bg-gradient-to-br from-navy to-[var(--navy-deep)] p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Punya Masukan Terkait Standar Pelayanan Kami?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200/90 sm:text-base">
              Partisipasi dan saran masyarakat sangat berarti bagi peningkatan mutu layanan kesehatan
              di UPTD Puskesmas Prapatan Kota Balikpapan.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/pengaduan" className="button-primary">
                Sampaikan Pengaduan / Saran
              </Link>
              <Link href="/layanan" className="button-ghost-light">
                Lihat Daftar Layanan &amp; Poli
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import PpidExplorer from "@/components/ppid/PpidExplorer";
import { PPID_CATEGORY_META, getPpidItems } from "@/lib/ppid-actions";
import type { PpidCategory } from "@/lib/admin-schemas";

export const metadata: Metadata = {
  title: "PPID — Pejabat Pengelola Informasi dan Dokumentasi",
  description:
    "Layanan Pejabat Pengelola Informasi dan Dokumentasi (PPID) UPTD Puskesmas Prapatan Kota Balikpapan — penyimpanan, pendokumentasian, penyediaan, dan pelayanan informasi publik.",
};

const duties = [
  {
    title: "Penyimpanan & Pendokumentasian",
    desc: "Mengumpulkan, menata, dan mendokumentasikan seluruh informasi publik di lingkungan UPTD Puskesmas Prapatan secara tertib dan akurat.",
  },
  {
    title: "Penyediaan Informasi Publik",
    desc: "Menyediakan daftar informasi publik secara berkala, serta merta, dan setiap saat agar mudah diakses oleh masyarakat luas.",
  },
  {
    title: "Pelayanan Permohonan Informasi",
    desc: "Melayani permohonan informasi publik dari warga secara cepat, tepat waktu, transparan, dan sederhana sesuai ketentuan peraturan perundang-undangan.",
  },
  {
    title: "Pengelolaan Keberatan & Evaluasi",
    desc: "Menindaklanjuti masukan atau keberatan pemohon informasi serta melakukan pemutakhiran data layanan kesehatan secara berkelanjutan.",
  },
];

const requestSteps = [
  {
    step: "01",
    title: "Ajukan Permohonan",
    desc: "Pemohon datang ke loket layanan informasi Puskesmas Prapatan atau menyampaikan permohonan melalui kanal resmi dengan melampirkan identitas diri (KTP).",
  },
  {
    step: "02",
    title: "Registrasi & Verifikasi",
    desc: "Petugas PPID mencatat permohonan dan memeriksa kelengkapan data serta klasifikasi informasi yang diminta.",
  },
  {
    step: "03",
    title: "Pemenuhan Informasi",
    desc: "PPID menyiapkan dokumen atau data yang dimohonkan sesuai standar waktu pelayanan informasi publik (maksimal 10 hari kerja).",
  },
  {
    step: "04",
    title: "Penyerahan Informasi",
    desc: "Dokumen atau informasi publik diserahkan kepada pemohon secara langsung maupun dalam bentuk salinan digital.",
  },
];

const categoryKeys: PpidCategory[] = [
  "berkala",
  "setiap-saat",
  "pelayanan-informasi",
  "sarana-prasarana",
  "digitalisasi-medsos",
  "komitmen",
];

export default async function PpidPage() {
  const ppidItems = await getPpidItems({ limit: 60 });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--navy-deep)] via-navy to-[var(--teal)] py-14 md:py-20">
        <div className="content-container max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">
            Keterbukaan Informasi Publik · UU No. 14 Tahun 2008
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            PPID Puskesmas Prapatan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200/95 sm:text-lg">
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) UPTD Puskesmas Prapatan bertanggung
            jawab di bidang penyimpanan, pendokumentasian, penyediaan, dan pelayanan informasi
            publik bagi masyarakat Kota Balikpapan.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container max-w-6xl space-y-14">
          {/* Tentang & Tugas Fungsi PPID */}
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
            <div className="panel p-6 sm:p-8">
              <div className="accent-bar">
                <p className="eyebrow">Profil Unit Kerja</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy">
                  Apa itu PPID?
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                <strong>Pejabat Pengelola Informasi dan Dokumentasi (PPID)</strong> merupakan
                pejabat atau unit kerja di badan publik yang bertanggung jawab di bidang
                penyimpanan, pendokumentasian, penyediaan, dan pelayanan informasi publik.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Melalui layanan PPID, UPTD Puskesmas Prapatan berkomitmen mewujudkan penyelenggaraan
                pelayanan kesehatan yang transparan, efektif, efisien, dan akuntabel sesuai amanat{" "}
                <strong>Undang-Undang Nomor 14 Tahun 2008</strong> tentang Keterbukaan Informasi
                Publik.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {duties.map((duty) => (
                <div
                  key={duty.title}
                  className="panel border-l-4 border-l-[var(--teal)] p-5"
                >
                  <h3 className="text-base font-bold tracking-tight text-navy">
                    {duty.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{duty.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Klasifikasi Informasi Publik */}
          <div>
            <div className="accent-bar mb-6">
              <p className="eyebrow">Klasifikasi</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Kategori Informasi Publik (PPID)
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryKeys.map((key) => {
                const meta = PPID_CATEGORY_META[key];
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

          {/* Daftar Informasi & Dokumen PPID */}
          <div id="daftar-informasi">
            <div className="accent-bar mb-6">
              <p className="eyebrow">Publikasi & Dokumen</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Daftar Informasi Publik PPID
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Telusuri dokumen, laporan, maklumat pelayanan, dan informasi resmi yang
                dipublikasikan oleh PPID Puskesmas Prapatan.
              </p>
            </div>

            <PpidExplorer items={ppidItems} />
          </div>

          {/* Alur Permohonan Informasi */}
          <div>
            <div className="accent-bar mb-6">
              <p className="eyebrow">Tata Cara</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Alur Permohonan Informasi Publik
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {requestSteps.map((s) => (
                <div key={s.step} className="panel flex flex-col p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--teal-soft)] text-sm font-extrabold text-[var(--teal)]">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 flex-grow text-sm leading-6 text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-[var(--radius-lg)] bg-gradient-to-br from-navy to-[var(--navy-deep)] p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Butuh Permohonan Informasi atau Pengaduan Layanan?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200/90 sm:text-base">
              Anda dapat mengunjungi loket PPID di UPTD Puskesmas Prapatan pada jam pelayanan kerja
              atau mengirim permohonan dan masukan melalui formulir daring kami.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/pengaduan" className="button-primary">
                Ajukan Permohonan / Masukan
              </Link>
              <Link href="/media-sosial" className="button-ghost-light">
                Kanal Media Sosial Resmi
              </Link>
              <Link href="/profil" className="button-ghost-light">
                Lihat Kontak &amp; Jam Layanan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { getLayanan } from "@/lib/layanan-actions";
import { plainText, truncateText } from "@/lib/public-content";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

type Layanan = { id: string; icon: string; nama_poli: string; deskripsi: string };

function ServiceGlyph({ label }: { label: string }) {
  const initial = (label || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-clinic-soft text-base font-bold text-clinic-teal"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default async function LayananSection() {
  const layanan = await getLayanan();
  const preview = (layanan as Layanan[]).slice(0, 6);

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

        {preview.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/layanan/${item.id}`}
                  className="panel panel-lift flex h-full flex-col p-6"
                >
                  <ServiceGlyph label={item.nama_poli} />
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-navy">
                    {item.nama_poli}
                  </h3>
                  <p className="mt-3 flex-grow text-sm leading-6 text-slate-600">
                    {truncateText(plainText(item.deskripsi), 140) || "Informasi layanan tersedia di halaman detail."}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-clinic-teal">
                    Lihat detail →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="panel mt-10 p-10 text-center text-slate-500">
            Belum ada layanan yang ditambahkan.
          </div>
        )}
      </div>
    </section>
  );
}

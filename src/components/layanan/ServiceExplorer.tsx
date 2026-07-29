"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { plainText, toServiceSearchText, truncateText } from "@/lib/public-content";

type Service = {
  id: string;
  nama_poli: string;
  deskripsi: string;
  icon?: string | null;
};

export default function ServiceExplorer({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    if (!normalizedQuery) return services;

    return services.filter((service) =>
      toServiceSearchText(service.nama_poli, service.deskripsi).includes(normalizedQuery),
    );
  }, [query, services]);

  return (
    <section aria-labelledby="service-list-heading">
      <label className="sr-only" htmlFor="service-search">Cari layanan</label>
      <input
        id="service-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari layanan"
        className="mb-8 min-h-11 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
      {filteredServices.length ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Daftar layanan">
          {filteredServices.map((service) => (
            <li key={service.id}>
              <Link href={`/layanan/${service.id}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600">
                {service.icon ? <span aria-hidden="true" className="mb-4 text-3xl">{service.icon}</span> : null}
                <h2 className="text-xl font-bold text-slate-900">{service.nama_poli}</h2>
                <p className="mt-3 text-slate-600">{truncateText(plainText(service.deskripsi), 180)}</p>
                <span className="mt-5 font-semibold text-teal-700">Lihat layanan <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-700" role="status">Layanan tidak ditemukan.</p>
      )}
    </section>
  );
}

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="service-list-heading" className="text-lg font-bold text-navy">
            Daftar layanan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {filteredServices.length} dari {services.length} layanan
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <label className="sr-only" htmlFor="service-search">
            Cari layanan
          </label>
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama poli atau deskripsi"
            className="input-field"
          />
        </div>
      </div>

      {filteredServices.length ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Daftar layanan">
          {filteredServices.map((service) => {
            const initial = (service.nama_poli || "?").trim().charAt(0).toUpperCase() || "?";
            return (
              <li key={service.id}>
                <Link
                  href={`/layanan/${service.id}`}
                  className="panel panel-lift flex h-full flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinic-teal"
                >
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-clinic-soft text-base font-bold text-clinic-teal"
                    aria-hidden="true"
                  >
                    {initial}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy">{service.nama_poli}</h3>
                  <p className="mt-3 flex-grow text-sm leading-6 text-slate-600">
                    {truncateText(plainText(service.deskripsi), 180)}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-clinic-teal">
                    Lihat layanan →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="panel p-8 text-center text-slate-600" role="status">
          Layanan tidak ditemukan.
        </p>
      )}
    </section>
  );
}

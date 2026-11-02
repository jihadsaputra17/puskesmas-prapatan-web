"use client";

import { useEffect, useState } from "react";
import {
  POLL_OPTIONS,
  type PollOptionKey,
  type PollSummary,
} from "@/lib/poll-actions";

const STORAGE_KEY = "pkm_prapatan_poll_voted_v1";

export default function PollingWidget({
  initialSummary,
}: {
  initialSummary: PollSummary;
}) {
  const [summary, setSummary] = useState<PollSummary>(initialSummary);
  const [selected, setSelected] = useState<PollOptionKey>("sangat_bermanfaat");
  const [votedOption, setVotedOption] = useState<PollOptionKey | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as PollOptionKey | null;
      if (saved && POLL_OPTIONS.some((o) => o.key === saved)) {
        setVotedOption(saved);
        setSelected(saved);
        setShowResults(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || votedOption) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: selected }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setError(data.error || "Gagal mengirim pilihan polling.");
      } else {
        if (data.results && typeof data.totalVotes === "number") {
          setSummary({ totalVotes: data.totalVotes, results: data.results });
        }
        setVotedOption(selected);
        setShowResults(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, selected);
        } catch {
          // Ignore storage write errors
        }
      }
    } catch {
      setError("Terjadi kendala jaringan saat mengirim suara.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel mx-auto max-w-3xl overflow-hidden p-6 sm:p-8">
      <div className="accent-bar">
        <p className="eyebrow">Polling Pengunjung</p>
        <h2
          id="polling-heading"
          className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl"
        >
          Apakah Website Ini Bermanfaat ?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Suara Anda membantu kami terus meningkatkan kualitas layanan informasi UPTD Puskesmas
          Prapatan.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!showResults ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <fieldset className="space-y-2.5">
            <legend className="sr-only">Pilihan manfaat website</legend>
            {POLL_OPTIONS.map((opt) => {
              const active = selected === opt.key;
              return (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-center gap-3.5 rounded-[var(--radius-sm)] border px-4 py-3.5 transition ${
                    active
                      ? "border-[var(--teal)] bg-[var(--teal-soft)]/70 text-navy shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="poll_option"
                    value={opt.key}
                    checked={active}
                    onChange={() => setSelected(opt.key)}
                    className="h-4 w-4 accent-[var(--teal)]"
                  />
                  <span className="text-sm font-semibold sm:text-base">{opt.label}</span>
                </label>
              );
            })}
          </fieldset>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button type="submit" disabled={submitting} className="button-primary">
              {submitting ? "Mengirim..." : "Kirim Suara"}
            </button>
            <button
              type="button"
              onClick={() => setShowResults(true)}
              className="button-secondary"
            >
              Lihat Hasil ({summary.totalVotes} suara)
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          {votedOption && (
            <div className="rounded-[var(--radius-sm)] border border-teal-200 bg-[var(--teal-soft)]/60 px-4 py-3 text-sm font-medium text-[var(--teal-dark)]">
              Terima kasih! Pilihan Anda telah tercatat.
            </div>
          )}

          <div className="space-y-3">
            {summary.results.map((item) => {
              const isUserVote = votedOption === item.key;
              return (
                <div
                  key={item.key}
                  className={`rounded-[var(--radius-sm)] border p-3.5 ${
                    isUserVote
                      ? "border-[var(--teal)] bg-[var(--teal-soft)]/35"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-bold text-navy">
                      {item.label}
                      {isUserVote && (
                        <span className="ml-2 rounded-full bg-[var(--teal)] px-2 py-0.5 text-[0.6875rem] font-semibold text-white">
                          Pilihan Anda
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {item.percentage}% ({item.votes} suara)
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-clinic-teal to-navy transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <span>Total responden: {summary.totalVotes} suara</span>
            {!votedOption && (
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="font-semibold text-[var(--teal)] hover:underline"
              >
                ← Kembali memilih
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

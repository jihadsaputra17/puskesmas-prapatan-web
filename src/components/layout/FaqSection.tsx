const faqData = [
  {
    id: "faq-1",
    question: "Bagaimana cara mendaftar untuk berobat di Puskesmas Prapatan?",
    answer:
      "Anda dapat mendaftar secara langsung di loket pendaftaran Puskesmas dengan membawa KTP dan Kartu BPJS (jika ada). Kami juga sedang mengembangkan sistem pendaftaran online yang akan segera diluncurkan.",
  },
  {
    id: "faq-2",
    question: "Apakah Puskesmas Prapatan melayani pasien BPJS Kesehatan?",
    answer:
      "Ya, kami melayani pasien BPJS Kesehatan. Pastikan faskes tingkat pertama Anda terdaftar di Puskesmas Prapatan agar layanan bisa diberikan secara gratis sesuai ketentuan.",
  },
  {
    id: "faq-3",
    question: "Jam berapa layanan Poli Gigi beroperasi?",
    answer:
      "Poli Gigi beroperasi dari hari Senin hingga Sabtu. Pendaftaran dibuka mulai pukul 07.30 WITA hingga 11.30 WITA. Hari Minggu dan libur nasional tutup.",
  },
  {
    id: "faq-4",
    question: "Apakah ada layanan gawat darurat (UGD) 24 Jam?",
    answer:
      "Saat ini Puskesmas Prapatan melayani gawat darurat pada jam operasional kerja. Untuk keadaan darurat di luar jam kerja, kami akan merujuk ke RS terdekat.",
  },
];

export default function FaqSection() {
  return (
    <section className="section-band bg-white" aria-labelledby="faq-heading">
      <div className="content-container max-w-3xl">
        <div className="accent-bar mb-8">
          <p className="eyebrow">Bantuan</p>
          <h2 id="faq-heading" className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Pertanyaan yang sering diajukan
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
            Jawaban singkat seputar layanan di Puskesmas Prapatan.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((faq) => (
            <details
              key={faq.id}
              className="group panel overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-navy transition-colors hover:text-clinic-teal focus-visible:outline-none">
                <span className="text-left text-base sm:text-lg">{faq.question}</span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clinic-soft text-clinic-teal transition group-open:rotate-45">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

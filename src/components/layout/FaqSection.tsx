import React from 'react';

const faqData = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara mendaftar untuk berobat di Puskesmas Prapatan?',
    answer: 'Anda dapat mendaftar secara langsung di loket pendaftaran Puskesmas dengan membawa KTP dan Kartu BPJS (jika ada). Kami juga sedang mengembangkan sistem pendaftaran online yang akan segera diluncurkan.',
  },
  {
    id: 'faq-2',
    question: 'Apakah Puskesmas Prapatan melayani pasien BPJS Kesehatan?',
    answer: 'Ya, kami melayani pasien BPJS Kesehatan. Pastikan faskes tingkat pertama Anda terdaftar di Puskesmas Prapatan agar layanan bisa diberikan secara gratis sesuai ketentuan.',
  },
  {
    id: 'faq-3',
    question: 'Jam berapa layanan Poli Gigi beroperasi?',
    answer: 'Poli Gigi beroperasi dari hari Senin hingga Sabtu. Pendaftaran dibuka mulai pukul 07.30 WITA hingga 11.30 WITA. Hari Minggu dan libur nasional tutup.',
  },
  {
    id: 'faq-4',
    question: 'Apakah ada layanan gawat darurat (UGD) 24 Jam?',
    answer: 'Saat ini Puskesmas Prapatan melayani gawat darurat pada jam operasional kerja. Untuk keadaan darurat di luar jam kerja, kami akan merujuk ke RS terdekat.',
  },
];

const FaqSection = () => {
  return (
    <section className="py-16 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Temukan jawaban untuk beberapa pertanyaan umum terkait layanan di Puskesmas Prapatan.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <details 
              key={faq.id} 
              className="group border-b border-slate-200 pb-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium text-slate-900 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-md transition-colors">
                <span className="text-left text-lg">{faq.question}</span>
                <span className="ml-6 flex-shrink-0 transition-transform duration-300 group-open:rotate-180">
                  <svg className="h-5 w-5 text-slate-500 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed pr-8 animate-in slide-in-from-top-2 fade-in duration-200">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
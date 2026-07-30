import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Konfigurasi SMTP belum tersedia. Hubungi admin untuk menyiapkan SMTP_HOST, SMTP_USER, dan SMTP_PASS.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export type PengaduanData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export async function kirimPengaduan(data: PengaduanData) {
  const to = process.env.PENGADUAN_TO || "puskesmasprapatan123@gmail.com";

  const transporter = getTransporter();

  const html = `
    <h2>Pengaduan Baru dari Website</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
      <tr><td style="padding:8px 12px;font-weight:700;background:#f1f5f9;">Nama</td><td style="padding:8px 12px;">${data.name}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:700;background:#f1f5f9;">No. HP/WA</td><td style="padding:8px 12px;">${data.phone}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:700;background:#f1f5f9;">Email</td><td style="padding:8px 12px;">${data.email || "—"}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:700;background:#f1f5f9;">Pesan</td><td style="padding:8px 12px;white-space:pre-wrap;">${data.message}</td></tr>
    </table>
    <hr style="margin-top:24px;border:none;border-top:1px solid #e2e8f0;"/>
    <p style="font-size:12px;color:#94a3b8;">
      Dikirim dari formulir pengaduan puskesmas-prapatan-web.vercel.app
    </p>
  `.trim();

  await transporter.sendMail({
    from: `"Pengaduan Website" <${process.env.SMTP_USER}>`,
    replyTo: data.email || data.phone,
    to,
    subject: `Pengaduan dari ${data.name} — ${data.phone}`,
    html,
  });
}

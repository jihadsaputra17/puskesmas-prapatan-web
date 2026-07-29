'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export type JadwalDokter = {
  id: string;
  doctor: string;
  poli: string;
  day: string;
  hours: string;
};

export async function getJadwalDokter(): Promise<JadwalDokter[]> {
  try {
    const { rows } = await sql`
      SELECT 
        id, 
        nama_dokter as doctor, 
        poli, 
        hari as day, 
        jam_mulai || ' - ' || jam_selesai as hours
      FROM jadwal_dokter
      ORDER BY poli ASC, nama_dokter ASC
    `;
    return rows as JadwalDokter[];
  } catch (error) {
    console.error('Database Error - getJadwalDokter:', error);
    throw new Error('Gagal mengambil data jadwal dokter.');
  }
}

export async function createBeritaKesehatan(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const excerpt = formData.get('excerpt') as string;
  let content = formData.get('content') as string;
  const template = (formData.get('template') as string) || 'standard';
  
  // Menarik SEMUA gambar yang dikirim dari ImageUploader
  const images = formData.getAll('images') as string[];
  const coverImage = images.length > 0 ? images[0] : '';

  // Jika ada lebih dari 1 gambar, sisipkan sisanya sebagai galeri di akhir artikel
  if (images.length > 1) {
    content += '\n\n<div class="mt-10 pt-6 border-t border-slate-200 not-prose">';
    content += '\n<h3 class="text-xl font-bold mb-4 text-slate-800">Galeri Foto</h3>';
    content += '\n<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6" style="scrollbar-width: thin;">';
    for (let i = 1; i < images.length; i++) {
      content += `\n<div class="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[60%] relative rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-video" style="min-height: 250px;">`;
      content += `\n<img src="${images[i]}" alt="Galeri Berita ${i}" class="absolute inset-0 w-full h-full object-cover m-0" />`;
      content += `\n</div>`;
    }
    content += '\n</div>\n</div>';
  }

  try {
    await sql`
      INSERT INTO health_news (title, slug, excerpt, content, image_url, template)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${coverImage}, ${template})
    `;
  } catch (error) {
    console.error('Database Error - createBeritaKesehatan:', error);
    throw new Error('Gagal menambahkan berita kesehatan.');
  }

  revalidatePath('/admin/berita');
  revalidatePath('/berita');
  revalidatePath('/');
}

export async function getBeritaKesehatan() {
  try {
    const { rows } = await sql`
      SELECT 
        id, title, slug, excerpt, image_url as "imageUrl", published_at as date
      FROM health_news
      ORDER BY published_at DESC
      LIMIT 6
    `;
    return rows;
  } catch (error) {
    console.error('Database Error - getBeritaKesehatan:', error);
    throw new Error('Gagal mengambil data berita kesehatan.');
  }
}

export async function getBeritaBySlug(slug: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM health_news WHERE slug = ${slug} LIMIT 1
    `;
    // Kembalikan data pertama jika ada, atau null jika tidak ditemukan
    return rows[0] || null;
  } catch (error) {
    console.error('Database Error - getBeritaBySlug:', error);
    throw new Error('Gagal mengambil detail berita.');
  }
}

export async function updateBeritaKesehatan(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const excerpt = formData.get('excerpt') as string;
  let content = formData.get('content') as string;
  const template = (formData.get('template') as string) || 'standard';

  // Menarik SEMUA gambar yang dikirim dari ImageUploader
  const images = formData.getAll('images') as string[];
  const coverImage = images.length > 0 ? images[0] : '';

  // Jika ada lebih dari 1 gambar, sisipkan sisanya sebagai galeri di akhir artikel
  if (images.length > 1) {
    content += '\n\n<div class="mt-10 pt-6 border-t border-slate-200 not-prose">';
    content += '\n<h3 class="text-xl font-bold mb-4 text-slate-800">Galeri Foto</h3>';
    content += '\n<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6" style="scrollbar-width: thin;">';
    for (let i = 1; i < images.length; i++) {
      content += `\n<div class="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[60%] relative rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-video" style="min-height: 250px;">`;
      content += `\n<img src="${images[i]}" alt="Galeri Berita ${i}" class="absolute inset-0 w-full h-full object-cover m-0" />`;
      content += `\n</div>`;
    }
    content += '\n</div>\n</div>';
  }

  try {
    await sql`
      UPDATE health_news 
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, image_url = ${coverImage}, template = ${template}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error - updateBeritaKesehatan:', error);
    throw new Error('Gagal memperbarui berita.');
  }
  revalidatePath('/admin/berita');
  revalidatePath('/berita');
  revalidatePath('/');
}

export async function deleteBeritaKesehatan(id: string) {
  try {
    await sql`DELETE FROM health_news WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error - deleteBeritaKesehatan:', error);
    throw new Error('Gagal menghapus berita.');
  }
  revalidatePath('/admin/berita');
  revalidatePath('/berita');
  revalidatePath('/');
}
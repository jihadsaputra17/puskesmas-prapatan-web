import { updateSettings } from '@/lib/settings-actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // 1. Cek Autentikasi & Otorisasi: Hanya superadmin yang boleh menyimpan
  if (session?.user?.role !== 'superadmin') {
    return NextResponse.json({ message: 'Akses ditolak. Anda tidak memiliki izin.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // 2. Panggil server action untuk update database
    await updateSettings(body);

    // 3. Kirim respons sukses
    return NextResponse.json({ message: 'Pengaturan berhasil disimpan!' });

  } catch (error) {
    console.error('API Settings Error:', error);
    // 4. Kirim respons error jika terjadi masalah
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
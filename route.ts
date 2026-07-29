import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const newPassword = 'Password123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Reset password untuk semua akun admin & superadmin
    const result = await sql`UPDATE users SET password = ${hashedPassword} WHERE role IN ('admin', 'superadmin') RETURNING email, role`;
    
    const updatedUsers = result.rows;

    return NextResponse.json({ message: 'Sukses! Password direset menjadi: Password123!', akun_terpengaruh: updatedUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
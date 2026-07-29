import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          // Mengambil data user dari database berdasarkan email
          const { rows } = await sql`SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1`;
          const user = rows[0];

          // Jika user tidak ditemukan atau tidak punya password di db
          if (!user || !user.password) {
            return null;
          }

          // Bandingkan password yang diinput dengan hash yang aman di database.
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

          if (passwordsMatch) {
            // Jika cocok, kembalikan objek user (tanpa password)
            return { id: user.id, name: user.name, email: user.email, role: user.role };
          }
        } catch (error) {
          console.error("Authorize Error:", error);
          return null; // Return null on database error
        }
        
        // Jika password tidak cocok
        return null;
      }
    })
  ],
  callbacks: {
    // Menyimpan ID dan role user ke dalam token JWT
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Menyimpan ID dan role user ke dalam objek session
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Tentukan halaman login kustom jika ada
  }
};
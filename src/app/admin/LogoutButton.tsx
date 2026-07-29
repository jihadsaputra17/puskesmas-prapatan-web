"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-800 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--navy-deep)]"
    >
      Keluar (Logout)
    </button>
  );
}
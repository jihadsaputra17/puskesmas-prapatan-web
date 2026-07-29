"use client";

import Link from 'next/link';
import { useState } from 'react';

const Header = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    { href: '/layanan', label: 'Layanan (Poli)' },
    { href: '/jadwal-dokter', label: 'Jadwal Dokter' },
    { href: '/berita', label: 'Berita' },
    { href: '/pengaduan', label: 'Pengaduan' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-2xl font-bold text-teal-600 hover:text-teal-700 rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              aria-label="Halaman Utama Puskesmas Prapatan"
            >
              Puskesmas Prapatan
            </Link>
          </div>

          {/* Navigasi Desktop */}
          <nav aria-label="Navigasi Utama Desktop" className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-700 hover:text-teal-600 rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md hover:bg-teal-100 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 flex items-center">
                Panel Admin
              </Link>
            )}
          </nav>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-teal-600 hover:bg-slate-100 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              <span className="sr-only">Buka menu utama</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-200 bg-white">
          <nav aria-label="Navigasi Utama Mobile" className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 mt-2 rounded-md text-base font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
                Panel Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation, LanguageToggle } from "@/lib/translate";
import { ThemeToggle } from "@/lib/theme";

interface HomeClientProps {
  user: any;
}

export default function HomeClient({ user }: HomeClientProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      id: "education",
      image: "/images/education.png",
      color: "#3467d6",
    },
    {
      id: "health",
      image: "/images/health.png",
      color: "#039bb8",
    },
    {
      id: "interior",
      image: "/images/police.svg",
      color: "#d88718",
    },
    {
      id: "civil",
      image: "/images/MSC.png",
      color: "#25845a",
    },
    {
      id: "agriculture",
      image: "/images/MAFF.png",
      color: "#b88311",
    },
  ] as const;

  return (
    <main className="flex justify-center p-0 md:p-8 min-h-screen animate-in fade-in duration-700">
      <div className="app-shell relative">
        {/* Topbar */}
        <header className="topbar sticky top-0 z-50 bg-[var(--paper)] border-b border-[var(--line)] -mx-[18px] md:-mx-[28px] px-[18px] md:px-[28px] mb-6 flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-[var(--line)]/50 transition-all active:scale-95 group"
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`w-5 h-0.5 bg-[var(--primary)] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-[var(--primary)] transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-[var(--primary)] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
          
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="TreamExam Logo"
              width={88}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        {/* Mobile Menu */}
        <nav className={`mobile-menu ${isMenuOpen ? 'max-h-[500px] opacity-100 mb-6 py-2' : 'max-h-0 opacity-0 mb-0 py-0'} bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] px-2 shadow-md overflow-hidden transition-all duration-500 ease-in-out`}>
          <div className="grid gap-1">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center p-3 rounded-md hover:bg-[var(--secondary)] transition-colors"
            >
              <i className="fa-solid fa-house w-8 text-center mr-2 text-[var(--primary)]"></i>
              <span className="font-medium">{t.common.home}</span>
            </Link>
            <Link 
              href="#categories" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center p-3 rounded-md hover:bg-[var(--secondary)] transition-colors"
            >
              <i className="fa-solid fa-building-columns w-8 text-center mr-2 text-[var(--primary)]"></i>
              <span className="font-medium">{t.home.categoryTitle}</span>
            </Link>
            {user ? (
              <Link 
                href="/user/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center p-3 rounded-md bg-[var(--primary)]/5 text-[var(--primary)] font-bold transition-colors"
              >
                <i className="fa-solid fa-gauge-high w-8 text-center mr-2"></i>
                {t.common.dashboard}
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center p-3 rounded-md bg-[var(--primary)]/5 text-[var(--primary)] font-bold transition-colors"
              >
                <i className="fa-solid fa-right-to-bracket w-8 text-center mr-2"></i>
                {t.common.signIn}
              </Link>
            )}
            <div className="h-px bg-[var(--line)] my-1"></div>
            <Link 
              href="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center p-3 rounded-md hover:bg-[var(--secondary)] transition-colors text-sm"
            >
              <i className="fa-solid fa-circle-info w-8 text-center mr-2 text-[var(--primary)]"></i>
              {t.common.about}
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-static bg-[var(--primary)] rounded-[var(--radius)] text-white p-6 md:p-10 mb-6 text-center shadow-lg">
          <Image 
            src="/images/logo1.png" 
            alt="TreamExam illustration" 
            width={90} 
            height={90} 
            className="mx-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
            {t.home.heroTitle}
          </h1>
          <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            {t.home.heroSubtitle}
          </p>
        </section>

        {/* Section Heading */}
        <div className="flex items-end justify-between mb-4" id="categories">
          <h2 className="text-xl md:text-2xl font-bold border-l-4 border-[var(--primary)] pl-3">
            {t.home.categoryTitle}
          </h2>
        </div>

        {/* Category List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] flex items-center gap-4 p-4 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ borderLeft: `5px solid ${category.color}` }}
            >
              <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                  src={category.image}
                  alt={t.categories[category.id].title}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-[15px] leading-snug group-hover:text-[var(--primary)] transition-colors" style={{ color: category.color }}>
                  {t.categories[category.id].title}
                </h3>
                <p className="text-[12px] text-[var(--muted)] mt-1 line-clamp-2">
                  {t.categories[category.id].desc}
                </p>
              </div>
              <i className="fa-solid fa-chevron-right text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all"></i>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 pb-4 border-t border-[var(--line)] text-center">
          <div className="text-[var(--primary)] font-bold mb-2">TREAMEXAM</div>
          <p className="text-[var(--muted)] text-sm mb-4">
            {t.home.footerNote}
          </p>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-wider text-[var(--muted)] font-bold">
            <Link href="/privacy" className="hover:text-[var(--primary)]">{t.common.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-[var(--primary)]">{t.common.termsOfService}</Link>
            <Link href="/contact" className="hover:text-[var(--primary)]">{t.common.contactUs}</Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .mobile-menu {
          display: flex;
          flex-direction: column;
        }
        .hero-static {
          background: linear-gradient(135deg, var(--primary) 0%, #b37851 100%);
        }
      `}</style>
    </main>
  );
}

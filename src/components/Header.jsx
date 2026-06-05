"use client";

import React, { useState, useEffect } from "react";
import { Wifi, ShieldCheck, Menu, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeaderActions from "./HeaderActions";

const DESKTOP_LINKS = [
  { label: "AXVOI Home", href: "https://axvoi.com", external: true },
  { label: "Tools", href: "https://axvoi.com/tools", external: true },
  { label: "Blog", href: "https://axvoi.com/blog", external: true },
  { label: "Contact", href: "https://axvoi.com/contact", external: true },
];

const MOBILE_LINKS = [
  { label: "AXVOI Home", href: "https://axvoi.com" },
  { label: "Tools", href: "https://axvoi.com/tools" },
  { label: "Brat Generator", href: "https://axvoi.com/tools/brat-generator" },
  { label: "Blog", href: "https://axvoi.com/blog" },
  { label: "Contact", href: "https://axvoi.com/contact" },
  { label: "Privacy Policy", href: "https://axvoi.com/privacy" },
  { label: "Terms & Conditions", href: "https://axvoi.com/terms" },
  { label: "Cookies Policy", href: "https://axvoi.com/cookies" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let ctx;
    const initHeaderAnim = async () => {
      const { gsap } = await import("gsap");
      
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".header-logo-animate",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
        );
        gsap.fromTo(
          ".header-nav-animate",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
        gsap.fromTo(
          ".header-badge-animate",
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.15 }
        );
        gsap.fromTo(
          ".header-actions-animate",
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.25 }
        );
      });
    };

    initHeaderAnim();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--header-border)] bg-[var(--header-bg)]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="header-logo-animate flex items-center gap-3 transition hover:opacity-80"
          aria-label="AXVOI SpeedTest Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[var(--primary)]/10">
            <Wifi className="text-[var(--primary)]" size={21} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-black tracking-tight text-white md:text-xl">
                AXVOI <span className="text-[#00df81]">SpeedTest</span>
              </div>

              <span className="hidden rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] sm:inline-flex">
                Pro
              </span>
            </div>

            <p className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:block">
              Professional Diagnostics
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="header-nav-animate hidden md:flex items-center gap-6">
          {DESKTOP_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold !text-white hover:!text-[#00df81] transition-colors flex items-center gap-1"
            >
              {label === "AXVOI Home" ? "AXVOI" : label}
            </a>
          ))}
        </nav>

        {/* Center Badge (shows only on extra large screens when nav is visible) */}
        <div className="header-badge-animate hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 shadow-sm xl:flex">
          <ShieldCheck size={15} className="text-[#00df81]" />
          <span>Secure Network Analysis</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00df81]" />
        </div>

        {/* Right Actions + Mobile Menu Button */}
        <div className="header-actions-animate flex items-center gap-2 md:gap-3">
          <HeaderActions />
          
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="border-b border-white/10 bg-[#030712] md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {MOBILE_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/5 hover:text-[#00df81] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                  <ExternalLink size={14} className="opacity-40" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

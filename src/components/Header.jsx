"use client";

import React, { useEffect } from "react";
import { Wifi, ShieldCheck } from "lucide-react";
import Link from "next/link";
import HeaderActions from "./HeaderActions";

export default function Header() {
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
                AXVOI SpeedTest
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

        {/* Center Badge */}
        <div className="header-badge-animate hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 shadow-sm lg:flex">
          <ShieldCheck size={15} className="text-[var(--primary)]" />
          <span>Secure Network Analysis</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
        </div>

        <div className="header-actions-animate">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useEffect } from "react";
import { AlertCircle, WifiOff, ArrowLeft, RefreshCw, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    let ctx;
    const initNotFoundAnim = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        // Floating radar pulse
        gsap.to(".radar-glow", {
          scale: 1.25,
          opacity: 0,
          duration: 2.2,
          repeat: -1,
          ease: "sine.out",
        });
        
        // Staggered elements entrance
        gsap.fromTo(
          ".not-found-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
          }
        );
      });
    };

    initNotFoundAnim();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <main className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#030813] text-white">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 py-12 text-center">
        {/* Animated Radar/Lost Icon */}
        <div className="not-found-item relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
          {/* Radar Sweep Ring */}
          <div className="radar-glow absolute inset-0 rounded-3xl border border-[#00df81]/30 bg-[#00df81]/5" />
          <WifiOff size={42} className="text-[#00df81] relative z-10" />
        </div>

        {/* 404 Status Pill */}
        <div className="not-found-item mb-4 inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
          <AlertCircle size={12} />
          Error Code: 404
        </div>

        {/* Headline */}
        <h1 className="not-found-item text-4xl font-black tracking-tight sm:text-5xl leading-tight text-white">
          Signal Lost in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00df81] to-emerald-400">
            Network Latency
          </span>
        </h1>

        <p className="not-found-item mt-4 text-sm leading-6 text-white/60">
          The requested page could not be located on the test server. The route may have been recalibrated, offline, or temporarily disconnected.
        </p>

        {/* Troubleshooting Checklist */}
        <div className="not-found-item my-8 rounded-[2rem] border border-white/5 bg-white/5 p-5 text-left backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#00df81]">
            <Compass size={14} />
            Diagnostic Check
          </div>
          
          <ul className="mt-3.5 space-y-2.5 text-xs text-white/50">
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00df81]" />
              <span>Verify that the URL address is spelled correctly.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00df81]" />
              <span>Ensure your broadband / local connection is stable.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span>Diagnostic routing might have refreshed in our sitemap registry.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="not-found-item flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00df81] px-5 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#022c1a] transition hover:bg-[#00c974] active:scale-[0.98] shadow-[0_0_25px_rgba(0,223,129,0.18)]"
          >
            <ArrowLeft size={14} />
            Home Dashboard
          </Link>
          
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 active:scale-[0.98]"
          >
            <RefreshCw size={13} />
            Retry Connection
          </button>
        </div>
      </div>
    </main>
  );
}

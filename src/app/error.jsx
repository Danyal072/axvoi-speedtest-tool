"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to an analytics service or dashboard
    console.error("AXVOI Diagnostic Error Caught:", error);
    
    let ctx;
    const initErrorAnim = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        // Pulse warning triangle glow
        gsap.to(".warning-glow", {
          opacity: 0.15,
          scale: 1.15,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
        
        // Element reveal animations
        gsap.fromTo(
          ".error-item-reveal",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      });
    };

    initErrorAnim();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [error]);

  return (
    <main className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#030813] text-white">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(244,63,94,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 py-12 text-center">
        {/* Animated Warning Icon */}
        <div className="error-item-reveal relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-rose-500/10 bg-rose-500/5 backdrop-blur-xl shadow-[0_0_40px_rgba(244,63,94,0.05)]">
          {/* Pulsing Warning Outline */}
          <div className="warning-glow absolute inset-0 rounded-3xl border border-rose-500/35 bg-rose-500/5 opacity-50" />
          <AlertTriangle size={42} className="text-rose-400 relative z-10 animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="error-item-reveal mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          System Latency Jitter
        </div>

        {/* Headline */}
        <h1 className="error-item-reveal text-4xl font-black tracking-tight sm:text-5xl leading-tight text-white">
          Diagnostic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
            Render Timeout
          </span>
        </h1>

        <p className="error-item-reveal mt-4 text-sm leading-6 text-white/60">
          An unexpected server exception or layout timeout has occurred during your speed test routing. We are ready to re-establish the connection.
        </p>

        {/* Troubleshooting actions */}
        <div className="error-item-reveal my-8 space-y-3">
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-rose-600 active:scale-[0.98] shadow-[0_0_25px_rgba(244,63,94,0.18)]"
            >
              <RefreshCw size={13} className="animate-spin-slow" />
              Recalibrate Engine
            </button>
            
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <Home size={13} />
              Return Home
            </Link>
          </div>

          {/* Stellate Error Details Drawer */}
          {error?.message && (
            <div className="rounded-[1.8rem] border border-white/5 bg-white/5 overflow-hidden backdrop-blur-md transition">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between px-5 py-4 text-xs font-bold text-white/70 hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <Terminal size={13} className="text-rose-400" />
                  View Diagnostic Codes
                </span>
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showDetails && (
                <div className="border-t border-white/5 bg-black/40 px-5 py-4 text-left font-mono text-[10px] text-rose-400/80 max-h-40 overflow-y-auto leading-relaxed scrollbar-thin">
                  <span className="font-bold text-rose-400 block mb-1">Exception Details:</span>
                  {error.message}
                  {error.digest && (
                    <div className="mt-2 text-white/40">
                      <span className="font-bold block">Transaction Digest:</span>
                      {error.digest}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

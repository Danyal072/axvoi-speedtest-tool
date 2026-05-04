"use client";

import { Wifi, ExternalLink, ShieldCheck, Activity } from "lucide-react";

const YEAR = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "https://axvoi.com/contact", external: true },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-white/10 bg-[#030813]/85 backdrop-blur-2xl">
      {/* Glow Line */}
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#15E28B]/45 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-[#15E28B]/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-5 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-[#15E28B]/25 blur-md" />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#15E28B]/30 bg-[#15E28B]/10 shadow-[0_0_20px_rgba(21,226,139,0.16)]">
                  <Wifi size={18} className="text-[#15E28B]" />
                </div>
              </div>

              <div>
                <p className="text-base font-black tracking-tight text-white">
                  AXVOI <span className="text-[#15E28B]">SpeedTest</span>
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  Professional Diagnostics
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/40">
              A clean and fast internet speed test experience powered by AXVOI.
            </p>
          </div>

          {/* Center badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/45">
              <ShieldCheck size={14} className="text-[#15E28B]" />
              Secure Test
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/45">
              <Activity size={14} className="text-sky-400" />
              Real-time Metrics
            </div>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-3"
            aria-label="Footer navigation"
          >
            {NAV_LINKS.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/38 transition hover:border-[#15E28B]/30 hover:bg-[#15E28B]/10 hover:text-[#15E28B]"
              >
                {label}
                {external && (
                  <ExternalLink
                    size={11}
                    className="opacity-45 transition group-hover:opacity-100"
                  />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/30">
            © {YEAR} AXVOI. All rights reserved.
          </p>

          <a
            href="https://axvoi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/35 transition hover:text-[#15E28B]"
          >
            Built by AXVOI
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
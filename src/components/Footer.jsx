"use client";

import React, { useEffect } from "react";
import { Wifi, ExternalLink, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";

const YEAR = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "https://axvoi.com/contact", external: true },
];

export default function Footer() {
  useEffect(() => {
    let ctx;
    const initFooterAnim = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".footer-item-animate",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".footer-container-animate",
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    };

    initFooterAnim();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <footer className="relative mt-auto w-full border-t border-[var(--border)] bg-[#f9fafb]">
      <div className="footer-container-animate mx-auto flex max-w-7xl flex-col gap-6 px-5 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="footer-item-animate flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <Link
              href="/"
              className="flex items-center gap-3 transition hover:opacity-80"
              aria-label="AXVOI SpeedTest Home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                <Wifi size={18} className="text-[#00df81]" />
              </div>

              <div>
                <p className="text-base font-black tracking-tight text-gray-900">
                  AXVOI <span className="text-[#00df81]">SpeedTest</span>
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                  Professional Diagnostics
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-gray-600">
              A clean and fast internet speed test experience powered by AXVOI.
            </p>
          </div>

          {/* Center badges */}
          <div className="footer-item-animate flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm">
              <ShieldCheck size={14} className="text-[#00df81]" />
              Secure Test
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm">
              <Activity size={14} className="text-sky-500" />
              Real-time Metrics
            </div>
          </div>

          {/* Links */}
          <nav
            className="footer-item-animate flex flex-wrap items-center justify-center gap-3"
            aria-label="Footer navigation"
          >
            {NAV_LINKS.map(({ label, href, external }) =>
              external ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-gray-500 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {label}
                  <ExternalLink
                    size={11}
                    className="opacity-50 transition group-hover:opacity-100"
                  />
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-gray-500 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="footer-item-animate flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500">
            © {YEAR} AXVOI. All rights reserved.
          </p>

          <a
            href="https://axvoi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-emerald-700"
          >
            Built by AXVOI
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
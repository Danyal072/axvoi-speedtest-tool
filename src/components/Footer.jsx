"use client";

import React, { useEffect } from "react";
import { Wifi, ExternalLink, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";

const YEAR = new Date().getFullYear();

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
            stagger: 0.08,
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
    <footer className="relative mt-auto w-full border-t border-[var(--border)] bg-[#f9fafb] text-gray-600">
      <div className="footer-container-animate mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="footer-item-animate flex flex-col items-center text-center md:items-start md:text-left gap-3">
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
            <p className="mt-2 text-sm leading-6 text-gray-600 max-w-xs">
              A free internet speed test tool by AXVOI.
            </p>
          </div>

          {/* Column 2: SpeedTest */}
          <div className="footer-item-animate flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              SpeedTest
            </p>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-700 transition">
                  Speed Test
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-700 transition">
                  Internet Speed Test Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: AXVOI */}
          <div className="footer-item-animate flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              AXVOI
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://axvoi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  AXVOI Home
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Tools
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/tools/brat-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Brat Generator
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Blog
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Contact
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-item-animate flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Legal
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://axvoi.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Privacy Policy
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Terms & Conditions
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://axvoi.com/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  Cookies Policy
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-item-animate mt-12 border-t border-gray-200 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row text-center sm:text-left">
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
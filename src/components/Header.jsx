import { Wifi, ShieldCheck } from "lucide-react";
import Link from "next/link";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030813]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 transition hover:opacity-80" aria-label="AXVOI SpeedTest Home">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#15E28B]/30 blur-xl" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-gradient-to-br from-[#15E28B]/20 to-white/5 shadow-[0_0_30px_rgba(21,226,139,0.18)]">
              <Wifi className="text-[#15E28B]" size={23} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="bg-gradient-to-r from-white via-[#B7FFE0] to-[#15E28B] bg-clip-text text-xl font-black tracking-tight text-transparent md:text-2xl">
                AXVOI SpeedTest
              </h1>

              <span className="hidden rounded-full border border-[#15E28B]/20 bg-[#15E28B]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#15E28B] sm:inline-flex">
                Pro
              </span>
            </div>

            <p className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35 sm:block">
              Professional Diagnostics
            </p>
          </div>
        </Link>

        {/* Center Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/55 shadow-inner lg:flex">
          <ShieldCheck size={15} className="text-[#15E28B]" />
          Secure Network Analysis
          <span className="h-1.5 w-1.5 rounded-full bg-[#15E28B] shadow-[0_0_10px_rgba(21,226,139,0.9)]" />
        </div>

        <HeaderActions />
      </div>
    </header>
  );
}
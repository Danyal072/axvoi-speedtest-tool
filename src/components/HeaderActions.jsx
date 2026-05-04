"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Clock,
  X,
  ArrowDown,
  ArrowUp,
  Activity,
  History,
  Wifi,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── History Drawer ─────────────────────────────────────────── */
function HistoryDrawer({ history, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[82vh] max-w-5xl flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#030813]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-5 md:px-7">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10 shadow-[0_0_24px_rgba(21,226,139,0.15)]">
                    <History size={19} className="text-[#15E28B]" />
                  </div>

                  <div>
                    <h2 className="text-base font-black tracking-tight text-white md:text-lg">
                      Test History
                    </h2>
                    <p className="mt-0.5 text-xs text-white/40">
                      Your recent network diagnostics results
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close history"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white active:scale-95"
              >
                <X size={19} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-5 py-5 md:px-7">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/10">
                    <Wifi size={24} className="text-[#15E28B]" />
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    No history available yet
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
                    Run your first speed test and your download, upload, and
                    ping results will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, i) => (
                    <motion.div
                      key={i}
                      className="group rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 transition hover:border-[#15E28B]/20 hover:bg-white/[0.055]"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Time */}
                        <div className="min-w-[150px]">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                            Test Time
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white/65">
                            {item.time}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid flex-1 grid-cols-3 gap-3">
                          <div className="rounded-2xl border border-[#15E28B]/10 bg-[#15E28B]/5 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">
                              <ArrowDown size={11} />
                              Down
                            </span>
                            <p className="mt-1 text-lg font-black text-[#15E28B]">
                              {item.dl}
                              <span className="ml-1 text-[10px] font-semibold text-white/35">
                                Mbps
                              </span>
                            </p>
                          </div>

                          <div className="rounded-2xl border border-sky-400/10 bg-sky-400/5 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">
                              <ArrowUp size={11} />
                              Up
                            </span>
                            <p className="mt-1 text-lg font-black text-sky-400">
                              {item.ul}
                              <span className="ml-1 text-[10px] font-semibold text-white/35">
                                Mbps
                              </span>
                            </p>
                          </div>

                          <div className="rounded-2xl border border-orange-400/10 bg-orange-400/5 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/35">
                              <Activity size={11} />
                              Ping
                            </span>
                            <p className="mt-1 text-lg font-black text-orange-400">
                              {item.ping}
                              <span className="ml-1 text-[10px] font-semibold text-white/35">
                                ms
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Header Actions ─────────────────────────────────────────── */
export default function HeaderActions() {
  const [clientIp, setClientIp] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch("/api/ip")
      .then((r) => r.json())
      .then((d) => {
        const ip = d.ip || d.clientIp || d.processedString || null;

        if (ip && typeof ip === "string" && ip.length > 5) {
          setClientIp(ip);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem("axvoi_speedtest_v3");

        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch {}
    };

    load();

    window.addEventListener("speedtest:complete", load);

    return () => window.removeEventListener("speedtest:complete", load);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 md:gap-3">
        {/* IP Badge */}
        {clientIp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold text-white/60 shadow-inner backdrop-blur-xl lg:flex"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#15E28B] opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#15E28B]" />
            </span>

            <Globe size={13} className="text-[#15E28B]" />

            <span className="max-w-[170px] truncate tracking-wide">
              {clientIp}
            </span>
          </motion.div>
        )}

        {/* History Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowHistory(true)}
          aria-label="Open test history"
          className="group relative overflow-hidden rounded-full border border-[#15E28B]/25 bg-[#15E28B]/10 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#15E28B]/80 backdrop-blur-xl transition hover:border-[#15E28B]/40 hover:bg-[#15E28B]/15 hover:text-[#15E28B] md:px-5"
        >
          <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

          <span className="relative flex items-center gap-2">
            <Clock
              size={15}
              className="text-[#15E28B]/75 transition group-hover:text-[#15E28B]"
            />

            <span className="hidden sm:inline">History</span>

            {history.length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#15E28B] px-1.5 text-[10px] font-black tracking-normal text-[#030813]">
                {history.length}
              </span>
            )}
          </span>
        </motion.button>
      </div>

      <HistoryDrawer
        history={history}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Globe,
  Clock,
  X,
  ArrowDown,
  ArrowUp,
  Activity,
  History,
  Wifi,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── History Dialog / Drawer ───────────────────────────────── */

function HistoryDrawer({ history, isOpen, onClose, onClearHistory }) {
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close history overlay"
            className="absolute inset-0 h-full w-full bg-gray-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-dialog-title"
            className="absolute bottom-0 left-1/2 flex max-h-[86svh] w-full max-w-5xl -translate-x-1/2 flex-col overflow-hidden rounded-t-[2rem] border border-[var(--border)] bg-white shadow-2xl"
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 230 }}
          >
            {/* Top bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-white px-5 py-5 md:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10">
                  <History size={19} className="text-[#15E28B]" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="history-dialog-title"
                    className="truncate text-base font-black tracking-tight text-[var(--foreground)] md:text-lg"
                  >
                    Test History
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                    Your recent network diagnostics results
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="hidden items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-600 transition hover:border-red-300 hover:bg-red-100 sm:inline-flex"
                  >
                    <Trash2 size={14} />
                    Delete Data
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close history"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Mobile delete button */}
            {history.length > 0 && (
              <div className="border-b border-[var(--border)] bg-white px-5 py-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-red-600 transition hover:border-red-300 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                  Delete My Data
                </button>
              </div>
            )}

            {/* Confirm delete box */}
            <AnimatePresence>
              {confirmClear && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="border-b border-red-200 bg-red-50 px-5 py-4 md:px-7"
                >
                  <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50">
                        <AlertTriangle size={18} className="text-red-500" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-gray-900">
                          Delete saved test history?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          This will remove your locally saved speed test history
                          from this browser. This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClearHistory();
                          setConfirmClear(false);
                        }}
                        className="rounded-full border border-red-300 bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-5 py-5 md:px-7">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/10">
                    <Wifi size={24} className="text-[#15E28B]" />
                  </div>

                  <h3 className="text-sm font-black text-gray-900">
                    No saved data available
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                    Your test history is stored only in this browser. Run a speed
                    test and your results will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, i) => (
                    <motion.div
                      key={`${item.time}-${i}`}
                      className="group rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-[#15E28B]/30 hover:shadow-md"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035 }}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Time */}
                        <div className="min-w-[150px]">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
                            Test Time
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {item.time || "Recent test"}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/5 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                              <ArrowDown size={11} />
                              Down
                            </span>

                            <p className="mt-1 text-lg font-black text-[#15E28B]">
                              {item.dl || "—"}
                              <span className="ml-1 text-[10px] font-semibold text-gray-500">
                                Mbps
                              </span>
                            </p>
                          </div>

                          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                              <ArrowUp size={11} />
                              Up
                            </span>

                            <p className="mt-1 text-lg font-black text-sky-500">
                              {item.ul || "—"}
                              <span className="ml-1 text-[10px] font-semibold text-gray-500">
                                Mbps
                              </span>
                            </p>
                          </div>

                          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                              <Activity size={11} />
                              Ping
                            </span>

                            <p className="mt-1 text-lg font-black text-orange-500">
                              {item.ping || "—"}
                              <span className="ml-1 text-[10px] font-semibold text-gray-500">
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
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Header Actions ───────────────────────────────────────── */

export default function HeaderActions() {
  const [clientIp, setClientIp] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let alive = true;

    fetch("/api/speedtest/ip?json=true", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load IP");
        return r.json();
      })
      .then((d) => {
        if (!alive) return;

        const ip = d.processedString || d.ip || d.clientIp || null;

        if (ip && typeof ip === "string" && ip.length > 5) {
          setClientIp(ip);
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const loadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem("axvoi_speedtest_v3");
      const parsed = saved ? JSON.parse(saved) : [];

      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();

    window.addEventListener("speedtest:complete", loadHistory);
    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("speedtest:complete", loadHistory);
      window.removeEventListener("storage", loadHistory);
    };
  }, [loadHistory]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem("axvoi_speedtest_v3");
      setHistory([]);
      window.dispatchEvent(new CustomEvent("speedtest:complete"));
    } catch {
      setHistory([]);
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 md:gap-3">
        {/* IP Badge */}
        {clientIp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="hidden max-w-[260px] items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm lg:flex"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#15E28B] opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#15E28B]" />
            </span>

            <Globe size={13} className="shrink-0 text-[#15E28B]" />

            <span className="truncate tracking-wide">{clientIp}</span>
          </motion.div>
        )}

        {/* History Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowHistory(true)}
          aria-label="Open test history"
          className="group relative overflow-hidden rounded-full border border-[#00df81]/25 bg-[#00df81]/10 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#00df81] transition hover:border-[#00df81]/40 hover:bg-[#00df81]/15 hover:text-white md:px-5"
        >
          <span className="relative flex items-center gap-2">
            <Clock size={15} className="text-[#00df81]" />

            <span className="hidden sm:inline">History</span>

            {history.length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00df81] px-1.5 text-[10px] font-black tracking-normal text-[#022c1a]">
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
        onClearHistory={clearHistory}
      />
    </>
  );
}
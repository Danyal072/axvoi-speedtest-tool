"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Play,
  Square,
  Activity,
  ArrowDown,
  ArrowUp,
  Zap,
  Wifi,
  ShieldCheck,
  RotateCcw,
  Signal,
  AlertTriangle,
  Gauge,
  Server,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────── */

const COLORS = {
  idle: "rgba(255,255,255,0.45)",
  ping: "#f97316",
  dl: "#15E28B",
  ul: "#38bdf8",
  done: "#15E28B",
  stopped: "#ef4444",
};

const PHASES = {
  "-1": {
    label: "Ready",
    title: "Internet Speed Test",
    description: "Check download, upload, ping and jitter in real time.",
    color: COLORS.idle,
  },
  "0": {
    label: "Connecting",
    title: "Preparing test engine",
    description: "Connecting to the speed test server.",
    color: COLORS.idle,
  },
  "1": {
    label: "Download",
    title: "Testing download speed",
    description: "Measuring how fast your connection receives data.",
    color: COLORS.dl,
  },
  "2": {
    label: "Latency",
    title: "Checking latency",
    description: "Measuring ping and jitter stability.",
    color: COLORS.ping,
  },
  "3": {
    label: "Upload",
    title: "Testing upload speed",
    description: "Measuring how fast your connection sends data.",
    color: COLORS.ul,
  },
  "4": {
    label: "Complete",
    title: "Test completed",
    description: "Your latest network results are ready.",
    color: COLORS.done,
  },
  "5": {
    label: "Stopped",
    title: "Test stopped",
    description: "You can start a new test anytime.",
    color: COLORS.stopped,
  },
};

const CIRC = 2 * Math.PI * 44;

/* ─── Helpers ─────────────────────────────────────────────── */

function getDialMax(speed) {
  const current = Number(speed) || 0;

  if (current <= 50) return 100;

  return Math.max(100, Math.ceil((current + 50) / 50) * 50);
}

function safeNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/* ─── Animated Number ─────────────────────────────────────── */

function AnimatedNumber({ value, fmt }) {
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { bounce: 0, duration: 650 });
  const disp = useTransform(sv, fmt);

  useEffect(() => {
    mv.set(value || 0);
  }, [value, mv]);

  return <motion.span>{disp}</motion.span>;
}

/* ─── Background ───────────────────────────────────────────── */

function AmbientBg({ color }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030813] pointer-events-none">
      <motion.div
        className="absolute -left-[12%] -top-[35%] h-[70vw] w-[70vw] rounded-full blur-[150px]"
        animate={{
          backgroundColor: color,
          scale: [1, 1.08, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-[35%] -right-[12%] h-[62vw] w-[62vw] rounded-full blur-[145px]"
        style={{ backgroundColor: "#15E28B" }}
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.05, 0.11, 0.05],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:120px_120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030813]/20 via-[#030813]/70 to-[#030813]" />
    </div>
  );
}

/* ─── Localhost Warning ───────────────────────────────────── */

function LocalhostWarning() {
  return (
    <div className="rounded-2xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-orange-300" />

        <p className="text-xs font-medium leading-5 text-orange-100/85">
          Localhost test detected. Results may show local server speed, not real ISP speed.
        </p>
      </div>
    </div>
  );
}

/* ─── Status Badge ────────────────────────────────────────── */

function StatusBadge({ loaded, testState, color, engineError }) {
  return (
    <AnimatePresence mode="wait">
      {engineError ? (
        <motion.div
          key="engine-error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2 backdrop-blur-xl"
        >
          <AlertTriangle size={14} className="text-red-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">
            Engine Failed
          </span>
        </motion.div>
      ) : !loaded ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-xl"
        >
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/10 border-t-[#15E28B]" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
            Loading
          </span>
        </motion.div>
      ) : (
        <motion.div
          key={`status-${testState}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-xl"
          style={{
            background: `${color}0D`,
            border: `1px solid ${color}35`,
            boxShadow: `0 0 22px ${color}18`,
          }}
        >
          <motion.span
            className="block h-2.5 w-2.5 rounded-full"
            animate={{ scale: [1, 1.45, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />

          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
            {PHASES[testState]?.label ?? "Ready"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Dial Visualizer ─────────────────────────────────────── */

function SpeedDial({
  speed,
  dialMax,
  phase,
  isRunning,
  onStart,
  onStop,
  disabled,
}) {
  const info = PHASES[phase] ?? PHASES["-1"];
  const color = info.color;
  const showStart = !isRunning && (phase === -1 || phase === 4 || phase === 5);
  const pct = Math.min((speed || 0) / dialMax, 1);

  return (
    <div className="relative mx-auto flex h-[310px] w-[310px] items-center justify-center sm:h-[370px] sm:w-[370px] lg:h-[420px] lg:w-[420px]">
      <AnimatePresence>
        {isRunning && (
          <motion.div
            key="pulse"
            className="absolute inset-8 rounded-full pointer-events-none"
            style={{ border: `1px solid ${color}` }}
            initial={{ scale: 1, opacity: 0.35 }}
            animate={{ scale: 1.55, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: color }}
      />

      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="speedDialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="55%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>

          <filter id="speedDialGlow">
            <feGaussianBlur stdDeviation="1.7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.035)"
          strokeWidth="0.5"
        />

        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="2 8"
          opacity={0.24}
          animate={{ rotate: isRunning ? 360 : 0 }}
          transition={{
            duration: isRunning ? 5 : 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "50px 50px" }}
        />

        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#speedDialGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC - CIRC * pct }}
          initial={{ strokeDashoffset: CIRC }}
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          filter="url(#speedDialGlow)"
        />
      </svg>

      <div className="absolute top-6 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 backdrop-blur-xl">
        Scale 0–{dialMax} Mbps
      </div>

      <motion.button
        type="button"
        disabled={disabled}
        onClick={isRunning ? onStop : onStart}
        className="relative z-10 flex h-[210px] w-[210px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full disabled:cursor-not-allowed disabled:opacity-50 sm:h-[250px] sm:w-[250px] lg:h-[280px] lg:w-[280px]"
        style={{
          background:
            "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 52%, rgba(0,0,0,0.26) 100%)",
          border: `1px solid ${
            isRunning ? color + "66" : "rgba(255,255,255,0.1)"
          }`,
          boxShadow: isRunning
            ? `0 0 95px ${color}2B, 0 0 38px ${color}18, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 0 55px rgba(21,226,139,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.965 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {showStart ? (
            <motion.div
              key="start"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-17 w-17 items-center justify-center rounded-full border border-[#15E28B]/35 bg-[#15E28B]/13 shadow-[0_0_35px_rgba(21,226,139,0.28)]">
                {phase === 4 ? (
                  <RotateCcw size={28} className="text-[#15E28B]" />
                ) : (
                  <Play size={30} className="ml-1 text-[#15E28B]" />
                )}
              </div>

              <div className="text-center">
                <span className="block text-[13px] font-black uppercase tracking-[0.25em] text-white/70">
                  {phase === 4 ? "Run Again" : "Start Test"}
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28">
                  Tap to begin
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="speed"
              className="flex flex-col items-center px-4 text-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="mb-2 text-[10px] font-black uppercase tracking-[0.32em]"
                style={{ color }}
              >
                {info.label}
              </motion.span>

              <span className="text-6xl font-black leading-none tracking-tighter text-white tabular-nums sm:text-7xl lg:text-8xl">
                <AnimatedNumber
                  value={speed}
                  fmt={(v) =>
                    v < 10 && v > 0 ? v.toFixed(2) : v.toFixed(1)
                  }
                />
              </span>

              <span className="mt-2 text-[11px] font-bold uppercase tracking-widest text-white/38">
                Mbps
              </span>

              {isRunning && (
                <motion.div
                  className="absolute bottom-8 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Square size={8} className="fill-current" />
                  Stop Test
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/* ─── Mini Metric ──────────────────────────────────────────── */

function MiniMetric({ label, value, unit, icon: Icon, active, color }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-xl"
      style={{
        background: active
          ? `linear-gradient(135deg, ${color}18, rgba(255,255,255,0.04))`
          : "rgba(255,255,255,0.045)",
        borderColor: active ? `${color}55` : "rgba(255,255,255,0.1)",
      }}
      whileHover={{ y: -2 }}
    >
      {active && (
        <div
          className="absolute inset-0 opacity-10 blur-2xl"
          style={{ backgroundColor: color }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border"
            style={{
              background: active ? `${color}1F` : "rgba(255,255,255,0.06)",
              borderColor: active ? `${color}40` : "rgba(255,255,255,0.1)",
            }}
          >
            <Icon size={16} style={{ color: active ? color : "rgba(255,255,255,0.45)" }} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/38">
              {label}
            </p>

            <div className="mt-1 flex items-end gap-1">
              <span
                className="text-2xl font-black leading-none tabular-nums"
                style={{
                  color: active ? color : "rgba(255,255,255,0.9)",
                }}
              >
                <AnimatedNumber
                  value={value}
                  fmt={(v) => (v === 0 ? "—" : v < 10 ? v.toFixed(2) : v.toFixed(1))}
                />
              </span>

              <span className="pb-0.5 text-[10px] font-bold uppercase text-white/35">
                {unit}
              </span>
            </div>
          </div>
        </div>

        {active && (
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.45, 1] }}
            transition={{ duration: 1.25, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Step Bar ─────────────────────────────────────────────── */

function StepBar({ testState }) {
  const steps = [
    { id: 2, label: "Ping", icon: Activity },
    { id: 1, label: "Download", icon: ArrowDown },
    { id: 3, label: "Upload", icon: ArrowUp },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl">
      {steps.map((step) => {
        const Icon = step.icon;
        const active = testState === step.id;
        const done =
          testState === 4 ||
          (step.id === 2 && [1, 3].includes(testState)) ||
          (step.id === 1 && testState === 3);

        return (
          <div
            key={step.id}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
              active
                ? "bg-[#15E28B]/10 text-[#15E28B]"
                : done
                ? "text-white/65"
                : "text-white/25"
            }`}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Result Box ───────────────────────────────────────────── */

function ResultBox({ testState, dlVal, ulVal, pingVal, isLocalhost }) {
  if (testState !== 4) return null;

  let label = "Good connection";
  let description = "Your network looks stable for browsing, streaming and daily work.";

  if (isLocalhost) {
    label = "Localhost result";
    description =
      "This is not your real ISP speed because the backend is running locally.";
  } else if (dlVal >= 200 && ulVal >= 50 && pingVal <= 30) {
    label = "Excellent connection";
    description = "Great for 4K streaming, gaming, video meetings and cloud work.";
  } else if (dlVal < 25 || pingVal > 100) {
    label = "Needs attention";
    description = "Your connection may feel slow for calls, uploads or gaming.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/8 p-4 backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#15E28B]/25 bg-[#15E28B]/10">
          <ShieldCheck size={18} className="text-[#15E28B]" />
        </div>

        <div>
          <h3 className="text-sm font-black text-white">{label}</h3>
          <p className="mt-1 text-xs leading-5 text-white/45">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export default function SpeedTestPage() {
  const [testState, setTestState] = useState(-1);
  const [liveData, setLiveData] = useState(null);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [engineError, setEngineError] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocalhost(
        ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
      );
    }
  }, []);

  useEffect(() => {
    const s = document.createElement("script");

    s.src = "/speedtest.js";
    s.async = true;

    s.onload = () => {
      setEngineLoaded(true);
      setEngineError(false);
    };

    s.onerror = () => {
      console.error("LibreSpeed engine failed to load from /speedtest.js");
      setEngineLoaded(false);
      setEngineError(true);
    };

    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);

      if (ref.current) {
        try {
          ref.current.abort();
        } catch {}

        ref.current = null;
      }
    };
  }, []);

  const pushHistory = useCallback((entry) => {
    try {
      const prev = JSON.parse(localStorage.getItem("axvoi_speedtest_v3") || "[]");

      localStorage.setItem(
        "axvoi_speedtest_v3",
        JSON.stringify([entry, ...prev].slice(0, 10))
      );

      window.dispatchEvent(new CustomEvent("speedtest:complete"));
    } catch {}
  }, []);

  const startTest = useCallback(() => {
    if (!window.Speedtest) {
      console.error("Speedtest engine is not loaded.");
      setEngineError(true);
      return;
    }

    if (ref.current) {
      try {
        ref.current.abort();
      } catch {}

      ref.current = null;
    }

    setLiveData(null);
    setTestState(0);

    const s = new window.Speedtest();
    ref.current = s;

    s.setParameter("url_dl", "/api/garbage");
    s.setParameter("url_ul", "/api/empty");
    s.setParameter("url_ping", "/api/empty");
    s.setParameter("url_getIp", "/api/ip");

    s.setParameter("test_order", "IP_D_U");

    s.setParameter("time_dl_max", 10);
    s.setParameter("time_ul_max", 10);
    s.setParameter("time_auto", true);

    s.setParameter("xhr_dlMultistream", 3);
    s.setParameter("xhr_ulMultistream", 2);

    s.setParameter("ping_count", 10);
    s.setParameter("garbagePhp_chunkSize", 20);

    let snap = null;

    s.onupdate = (d) => {
      snap = d;
      setTestState(parseInt(d.testState, 10));
      setLiveData({ ...d });
    };

    s.onend = (aborted) => {
      setTestState(aborted ? 5 : 4);

      if (!aborted && snap) {
        pushHistory({
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dl: (safeNumber(snap.dlStatus) || 0).toFixed(1),
          ul: (safeNumber(snap.ulStatus) || 0).toFixed(1),
          ping: (safeNumber(snap.pingStatus) || 0).toFixed(1),
        });
      }

      ref.current = null;
    };

    s.start();
  }, [pushHistory]);

  const stopTest = useCallback(() => {
    try {
      ref.current?.abort();
    } catch {}

    ref.current = null;
    setTestState(5);
  }, []);

  const isRunning = testState >= 0 && testState <= 3;
  const phaseInfo = PHASES[testState] ?? PHASES["-1"];
  const color = phaseInfo.color;

  const dlSpeed = testState === 1 ? safeNumber(liveData?.dlStatus) : 0;
  const ulSpeed = testState === 3 ? safeNumber(liveData?.ulStatus) : 0;
  const speed = dlSpeed || ulSpeed;

  const pingVal = safeNumber(liveData?.pingStatus);
  const jitterVal = safeNumber(liveData?.jitterStatus);
  const dlVal = safeNumber(liveData?.dlStatus);
  const ulVal = safeNumber(liveData?.ulStatus);

  const dialMax = useMemo(() => getDialMax(Math.max(speed, dlVal, ulVal)), [
    speed,
    dlVal,
    ulVal,
  ]);

  return (
    <main className="relative w-full overflow-x-hidden bg-[#030813] text-white selection:bg-[#15E28B]/20">
      <AmbientBg color={color} />

      {/* 
        Full screen viewport area:
        Header remains above from RootLayout.
        Footer stays below because this section uses viewport height.
      */}
      <section className="relative z-10 flex min-h-[calc(100svh-86px)] w-full items-center px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 xl:grid-cols-[360px_1fr_360px]">
          {/* Left Panel */}
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="order-2 space-y-4 xl:order-1"
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-[#15E28B]/10 shadow-[0_0_25px_rgba(21,226,139,0.18)]">
                  <Gauge size={22} className="text-[#15E28B]" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#15E28B]">
                    AXVOI SpeedTest
                  </p>
                  <h2 className="mt-1 text-xl font-black text-white">
                    Professional Diagnostics
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Real-time LibreSpeed powered internet diagnostics with clean
                visual feedback for download, upload, ping and jitter.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <Server size={16} className="text-[#15E28B]" />
                  <span className="text-xs font-semibold text-white/55">
                    Server-based speed measurement
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <Signal size={16} className="text-sky-400" />
                  <span className="text-xs font-semibold text-white/55">
                    Dynamic dial scale with +50 margin
                  </span>
                </div>
              </div>
            </div>

            {isLocalhost && <LocalhostWarning />}
          </motion.aside>

          {/* Center Dial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="order-1 flex flex-col items-center text-center xl:order-2"
          >
            <StatusBadge
              loaded={engineLoaded}
              testState={testState}
              color={color}
              engineError={engineError}
            />

            <motion.div
              key={testState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {phaseInfo.title}
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/52 sm:text-base">
                {phaseInfo.description}
              </p>
            </motion.div>

            <div className="mt-3">
              <SpeedDial
                speed={speed}
                dialMax={dialMax}
                phase={testState}
                isRunning={isRunning}
                onStart={startTest}
                onStop={stopTest}
                disabled={!engineLoaded || engineError}
              />
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="order-3 space-y-4"
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10 shadow-[0_0_25px_rgba(56,189,248,0.14)]">
                  <Wifi size={22} className="text-sky-400" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                    Active Status
                  </p>
                  <h2 className="mt-1 text-2xl font-black" style={{ color }}>
                    {phaseInfo.label}
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                {isRunning
                  ? "Keep this tab open while the test is running."
                  : engineError
                  ? "Speedtest engine failed to load. Check /public/speedtest.js."
                  : "Press the center dial to begin your internet speed test."}
              </p>

              <div className="mt-5">
                <StepBar testState={testState} />
              </div>
            </div>

            <ResultBox
              testState={testState}
              dlVal={dlVal}
              ulVal={ulVal}
              pingVal={pingVal}
              isLocalhost={isLocalhost}
            />
          </motion.aside>

          {/* Bottom Metrics - Full Width */}
          <motion.div
            className="order-4 grid w-full gap-3 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            <MiniMetric
              label="Ping"
              value={pingVal}
              unit="ms"
              icon={Activity}
              active={testState === 2}
              color={COLORS.ping}
            />

            <MiniMetric
              label="Jitter"
              value={jitterVal}
              unit="ms"
              icon={Zap}
              active={testState === 2}
              color="#facc15"
            />

            <MiniMetric
              label="Download"
              value={dlVal}
              unit="Mbps"
              icon={ArrowDown}
              active={testState === 1}
              color={COLORS.dl}
            />

            <MiniMetric
              label="Upload"
              value={ulVal}
              unit="Mbps"
              icon={ArrowUp}
              active={testState === 3}
              color={COLORS.ul}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
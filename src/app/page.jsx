"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  Gauge,
  ShieldCheck,
  RotateCcw,
  Signal,
  AlertTriangle,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────── */
const MAX_SPEED = 1000;

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
    title: "Start your network test",
    description: "Measure your ping, download, and upload speed.",
    color: COLORS.idle,
  },
  "0": {
    label: "Connecting",
    title: "Finding best route",
    description: "Preparing diagnostics engine...",
    color: COLORS.idle,
  },
  "1": {
    label: "Download",
    title: "Testing download speed",
    description: "Checking how fast your connection receives data.",
    color: COLORS.dl,
  },
  "2": {
    label: "Latency",
    title: "Checking response time",
    description: "Measuring ping and jitter stability.",
    color: COLORS.ping,
  },
  "3": {
    label: "Upload",
    title: "Testing upload speed",
    description: "Checking how fast your connection sends data.",
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
    description: "You can start a fresh test anytime.",
    color: COLORS.stopped,
  },
};

const CIRC = 2 * Math.PI * 44;

/* ─── Animated Number ───────────────────────────────────────── */
function AnimatedNumber({ value, fmt }) {
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { bounce: 0, duration: 650 });
  const disp = useTransform(sv, fmt);

  useEffect(() => {
    mv.set(value || 0);
  }, [value, mv]);

  return <motion.span>{disp}</motion.span>;
}

/* ─── Ambient Background ────────────────────────────────────── */
function AmbientBg({ color }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030813] pointer-events-none">
      <motion.div
        className="absolute -left-[18%] -top-[28%] h-[75vw] w-[75vw] rounded-full blur-[150px]"
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
        className="absolute -bottom-[28%] -right-[18%] h-[65vw] w-[65vw] rounded-full blur-[140px]"
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

      <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:120px_120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030813]/30 via-[#030813]/65 to-[#030813]" />
    </div>
  );
}

/* ─── Localhost Warning ─────────────────────────────────────── */
function LocalhostWarning() {
  return (
    <div className="mx-auto mb-7 max-w-3xl rounded-3xl border border-orange-400/25 bg-orange-400/10 px-5 py-4 text-center backdrop-blur-xl">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <AlertTriangle size={18} className="text-orange-300" />

        <p className="text-sm font-medium leading-6 text-orange-100/90">
          You are testing on localhost. Results may show local computer/server
          speed, not your real internet speed. Deploy this app to a remote server
          for accurate readings.
        </p>
      </div>
    </div>
  );
}

/* ─── Status Badge ──────────────────────────────────────────── */
function StatusBadge({ loaded, testState, color, engineError }) {
  return (
    <AnimatePresence mode="wait">
      {engineError ? (
        <motion.div
          key="engine-error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-3 rounded-full border border-red-400/25 bg-red-400/10 px-5 py-2.5 backdrop-blur-xl"
        >
          <AlertTriangle size={15} className="text-red-300" />
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-red-200">
            Engine Failed
          </span>
        </motion.div>
      ) : !loaded ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-5 py-2.5 backdrop-blur-xl"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-[#15E28B]" />
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-white/45">
            Calibrating
          </span>
        </motion.div>
      ) : (
        <motion.div
          key={`status-${testState}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 backdrop-blur-xl"
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

          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-white/80">
            {PHASES[testState]?.label ?? "Ready"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Result Summary ────────────────────────────────────────── */
function ResultSummary({ testState, dlVal, ulVal, pingVal, isLocalhost }) {
  if (testState !== 4) return null;

  let label = "Good connection";
  let description =
    "Your network looks stable for browsing, streaming, and daily work.";

  if (isLocalhost) {
    label = "Localhost result";
    description =
      "This result is not your real ISP speed because the backend is running on the same machine.";
  } else if (dlVal >= 200 && ulVal >= 50 && pingVal <= 30) {
    label = "Excellent connection";
    description = "Great for 4K streaming, video meetings, cloud work, and gaming.";
  } else if (dlVal < 25 || pingVal > 100) {
    label = "Needs attention";
    description =
      "Your connection may feel slow for video calls, uploads, or gaming.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-5 max-w-xl rounded-3xl border border-[#15E28B]/20 bg-[#15E28B]/8 px-5 py-4 text-center backdrop-blur-xl"
    >
      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10">
        <ShieldCheck size={19} className="text-[#15E28B]" />
      </div>

      <h3 className="text-base font-black text-white">{label}</h3>

      <p className="mt-1 text-sm leading-6 text-white/45">{description}</p>
    </motion.div>
  );
}

/* ─── Aura Visualizer ───────────────────────────────────────── */
function AuraVisualizer({ speed, phase, isRunning, onStart, onStop, disabled }) {
  const info = PHASES[phase] ?? PHASES["-1"];
  const color = info.color;
  const showStart = !isRunning && (phase === -1 || phase === 4 || phase === 5);
  const pct = Math.min((speed || 0) / MAX_SPEED, 1);

  return (
    <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[340px] sm:w-[340px]">
      <AnimatePresence>
        {isRunning && (
          <motion.div
            key="pulse"
            className="absolute inset-6 rounded-full pointer-events-none"
            style={{ border: `1.5px solid ${color}` }}
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 1.75, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>

          <filter id="auraGlow">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
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
          strokeDasharray="3 10"
          opacity={0.22}
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
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#auraGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC - CIRC * pct }}
          initial={{ strokeDashoffset: CIRC }}
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          filter="url(#auraGlow)"
        />
      </svg>

      <motion.button
        type="button"
        disabled={disabled}
        className="relative z-10 flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full disabled:cursor-not-allowed disabled:opacity-50 sm:h-[220px] sm:w-[220px]"
        style={{
          background:
            "radial-gradient(circle at 38% 28%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 58%, rgba(0,0,0,0.24) 100%)",
          border: `1px solid ${
            isRunning ? color + "55" : "rgba(255,255,255,0.09)"
          }`,
          boxShadow: isRunning
            ? `0 0 80px ${color}25, 0 0 32px ${color}16, inset 0 1px 0 rgba(255,255,255,0.08)`
            : "0 0 45px rgba(21,226,139,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
        onClick={isRunning ? onStop : onStart}
        whileHover={disabled ? {} : { scale: 1.035 }}
        whileTap={disabled ? {} : { scale: 0.965 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.075] to-transparent pointer-events-none" />

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
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: "rgba(21,226,139,0.13)",
                  boxShadow: "0 0 30px rgba(21,226,139,0.28)",
                  border: "1px solid rgba(21,226,139,0.34)",
                }}
              >
                {phase === 4 ? (
                  <RotateCcw size={25} className="text-[#15E28B]" />
                ) : (
                  <Play size={27} className="ml-1 text-[#15E28B]" />
                )}
              </div>

              <div className="text-center">
                <span className="block text-[12px] font-black uppercase tracking-[0.24em] text-white/65">
                  {phase === 4 ? "Run Again" : "Start Test"}
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
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
                className="mb-2 text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color }}
              >
                {info.label}
              </motion.span>

              <span className="text-5xl font-black leading-none tracking-tighter text-white tabular-nums sm:text-6xl">
                <AnimatedNumber
                  value={speed}
                  fmt={(v) =>
                    v < 10 && v > 0 ? v.toFixed(2) : v.toFixed(1)
                  }
                />
              </span>

              <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                Mbps
              </span>

              {isRunning && (
                <motion.div
                  className="absolute bottom-6 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/28"
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

/* ─── Metric Card ───────────────────────────────────────────── */
function MetricCard({ label, value, unit, icon: Icon, isActive, color, helper }) {
  const val = Number.isNaN(value) ? 0 : value;
  const filled = val > 0;
  const barPct = Math.min((val / (unit === "ms" ? 200 : MAX_SPEED)) * 100, 100);

  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-[1.5rem] border p-5 backdrop-blur-xl"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${color}18 0%, rgba(255,255,255,0.05) 100%)`
          : "rgba(255,255,255,0.045)",
        borderColor: isActive ? `${color}55` : "rgba(255,255,255,0.1)",
        boxShadow: isActive
          ? `0 0 36px ${color}18, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {isActive && (
        <div
          className="absolute -inset-2 rounded-[1.5rem] opacity-20 blur-2xl pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              background: isActive ? `${color}22` : "rgba(255,255,255,0.07)",
              border: `1px solid ${
                isActive ? color + "40" : "rgba(255,255,255,0.12)"
              }`,
            }}
          >
            <Icon
              size={18}
              style={{
                color: isActive ? color : "rgba(255,255,255,0.55)",
              }}
            />
          </div>

          <div>
            <p
              className="text-[11px] font-black uppercase tracking-[0.16em]"
              style={{
                color: isActive ? color : "rgba(255,255,255,0.7)",
              }}
            >
              {label}
            </p>

            <p className="mt-1 text-xs font-medium text-white/45">{helper}</p>
          </div>
        </div>

        {isActive && (
          <motion.span
            className="mt-2 block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: [1, 0.35, 1], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.25, repeat: Infinity }}
          />
        )}
      </div>

      <div className="relative z-10 mt-6 flex items-end gap-1.5">
        <span
          className="text-4xl font-black leading-none tracking-tight tabular-nums"
          style={{
            color: filled
              ? isActive
                ? color
                : "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.35)",
          }}
        >
          <AnimatedNumber
            value={val}
            fmt={(v) => (v === 0 ? "—" : v < 10 ? v.toFixed(2) : v.toFixed(1))}
          />
        </span>

        <span className="pb-1 text-xs font-bold uppercase tracking-wide text-white/45">
          {unit}
        </span>
      </div>

      <div className="relative z-10 mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
          animate={{ width: `${barPct}%` }}
          initial={{ width: "0%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.55 }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Step Indicator ────────────────────────────────────────── */
function StepIndicator({ testState }) {
  const steps = [
    { id: 2, label: "Ping", icon: Activity },
    { id: 1, label: "Download", icon: ArrowDown },
    { id: 3, label: "Upload", icon: ArrowUp },
  ];

  return (
    <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl">
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
            className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-black uppercase tracking-wider transition ${
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

/* ─── Main Page ─────────────────────────────────────────────── */
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
      const prev = JSON.parse(
        localStorage.getItem("axvoi_speedtest_v3") || "[]"
      );

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

    /*
      Important:
      Do not add cacheBust here.
      LibreSpeed automatically appends its own query params like ckSize.
      Testing on localhost will still show local server speed, not real ISP speed.
    */
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
          dl: (parseFloat(snap.dlStatus) || 0).toFixed(1),
          ul: (parseFloat(snap.ulStatus) || 0).toFixed(1),
          ping: (parseFloat(snap.pingStatus) || 0).toFixed(1),
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

  const dlSpeed = testState === 1 ? parseFloat(liveData?.dlStatus) || 0 : 0;
  const ulSpeed = testState === 3 ? parseFloat(liveData?.ulStatus) || 0 : 0;
  const speed = dlSpeed || ulSpeed;

  const pingVal = parseFloat(liveData?.pingStatus) || 0;
  const jitterVal = parseFloat(liveData?.jitterStatus) || 0;
  const dlVal = parseFloat(liveData?.dlStatus) || 0;
  const ulVal = parseFloat(liveData?.ulStatus) || 0;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030813] text-white selection:bg-[#15E28B]/20">
      <AmbientBg color={color} />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLocalhost && <LocalhostWarning />}

        <div className="mx-auto mb-8 max-w-3xl text-center">
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
            className="mt-5"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/20 bg-[#15E28B]/8 px-4 py-2 text-xs font-bold text-[#15E28B] backdrop-blur-xl">
              <Signal size={14} />
              AXVOI Professional Diagnostics
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {phaseInfo.title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/60">
              {phaseInfo.description}
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="order-2 rounded-[1.5rem] border border-white/10 bg-[#07101f]/80 p-5 lg:order-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-[#15E28B]/10 shadow-[0_0_25px_rgba(21,226,139,0.18)]">
                <Gauge size={22} className="text-[#15E28B]" />
              </div>

              <h2 className="mt-5 text-xl font-black text-white">
                Real-time speed testing
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                AXVOI SpeedTest checks your connection performance using live download,
                upload, ping, and jitter measurements.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Low latency detection",
                  "Download and upload testing",
                  "Local history saved in browser",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-white/70"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#15E28B] shadow-[0_0_10px_rgba(21,226,139,0.9)]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="order-1 flex flex-col items-center lg:order-2"
            >
              <div
                className="absolute h-[280px] w-[280px] rounded-full opacity-[0.12] blur-3xl pointer-events-none"
                style={{ backgroundColor: color }}
              />

              <AuraVisualizer
                speed={speed}
                phase={testState}
                isRunning={isRunning}
                onStart={startTest}
                onStop={stopTest}
                disabled={!engineLoaded || engineError}
              />

              <StepIndicator testState={testState} />

              <ResultSummary
                testState={testState}
                dlVal={dlVal}
                ulVal={ulVal}
                pingVal={pingVal}
                isLocalhost={isLocalhost}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="order-3 rounded-[1.5rem] border border-white/10 bg-[#07101f]/80 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10 shadow-[0_0_25px_rgba(56,189,248,0.14)]">
                <Wifi size={22} className="text-sky-400" />
              </div>

              <h2 className="mt-5 text-xl font-black text-white">
                Current test focus
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                The active phase is highlighted clearly so users always
                understand what is being measured.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                  Active Status
                </p>

                <p className="mt-2 text-3xl font-black" style={{ color }}>
                  {phaseInfo.label}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {isRunning
                    ? "Please keep this tab open while the test is running."
                    : engineError
                    ? "Speedtest engine failed to load. Check /public/speedtest.js."
                    : "Press the center button when you are ready."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.15,
            ease: "easeOut",
          }}
        >
          <MetricCard
            label="Ping"
            helper="Response time"
            value={pingVal}
            unit="ms"
            icon={Activity}
            isActive={testState === 2}
            color={COLORS.ping}
          />

          <MetricCard
            label="Jitter"
            helper="Signal stability"
            value={jitterVal}
            unit="ms"
            icon={Zap}
            isActive={testState === 2}
            color="#facc15"
          />

          <MetricCard
            label="Download"
            helper="Receiving speed"
            value={dlVal}
            unit="Mbps"
            icon={ArrowDown}
            isActive={testState === 1}
            color={COLORS.dl}
          />

          <MetricCard
            label="Upload"
            helper="Sending speed"
            value={ulVal}
            unit="Mbps"
            icon={ArrowUp}
            isActive={testState === 3}
            color={COLORS.ul}
          />
        </motion.div>
      </section>
    </main>
  );
}
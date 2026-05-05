"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
import SpeedTestFAQ from "@/components/SpeedTestFAQ";

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
    description: "Check your download, upload, ping and jitter in real time.",
    color: COLORS.idle,
    glow: "rgba(107, 114, 128, 0.35)",
  },
  "0": {
    label: "Connecting",
    title: "Preparing Test",
    description: "Connecting to the speed test server.",
    color: COLORS.idle,
    glow: "rgba(107, 114, 128, 0.35)",
  },
  "1": {
    label: "Download",
    title: "Testing Download",
    description: "Measuring how fast your connection receives data.",
    color: COLORS.dl,
    glow: "rgba(21, 226, 139, 0.45)",
  },
  "2": {
    label: "Latency",
    title: "Checking Latency",
    description: "Measuring ping and jitter stability.",
    color: COLORS.ping,
    glow: "rgba(249, 115, 22, 0.45)",
  },
  "3": {
    label: "Upload",
    title: "Testing Upload",
    description: "Measuring how fast your connection sends data.",
    color: COLORS.ul,
    glow: "rgba(56, 189, 248, 0.45)",
  },
  "4": {
    label: "Complete",
    title: "Test Completed",
    description: "Your latest network results are ready.",
    color: COLORS.done,
    glow: "rgba(21, 226, 139, 0.45)",
  },
  "5": {
    label: "Stopped",
    title: "Test Stopped",
    description: "You can start a new test anytime.",
    color: COLORS.stopped,
    glow: "rgba(239, 68, 68, 0.45)",
  },
};

/* ─── Helpers ─────────────────────────────────────────────── */

function getDialMax(speed) {
  const current = Number(speed) || 0;

  if (current <= 50) return 100;

  return Math.max(100, Math.ceil((current + 50) / 50) * 50);
}

function safeNumber(value, fallback = 0) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "..." ||
    value === "NaN"
  ) {
    return fallback;
  }

  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function hasValidNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "..." ||
    value === "NaN"
  ) {
    return false;
  }

  const n = parseFloat(value);
  return Number.isFinite(n);
}

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

/* ─── Animated Number ─────────────────────────────────────── */

function AnimatedNumber({ value, fmt, isValid = true }) {
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { bounce: 0, duration: 650 });
  const disp = useTransform(sv, fmt);

  useEffect(() => {
    if (isValid) {
      mv.set(value || 0);
    }
  }, [value, mv, isValid]);

  if (!isValid) {
    return <span>—</span>;
  }

  return <motion.span>{disp}</motion.span>;
}

/* ─── Background ───────────────────────────────────────────── */

function AmbientBg({ color }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030813]">
      <div
        className="blur-reduced animate-bg-scale-1 absolute -left-[14%] -top-[36%] h-[66vw] w-[66vw] rounded-full"
        style={{ backgroundColor: color }}
      />

      <div
        className="blur-reduced animate-bg-scale-2 absolute -bottom-[36%] -right-[14%] h-[58vw] w-[58vw] rounded-full"
        style={{ backgroundColor: "#15E28B" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:120px_120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030813]/20 via-[#030813]/76 to-[#030813]" />
    </div>
  );
}

const LocalhostWarning = React.memo(() => {
  return (
    <div className="rounded-2xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-orange-300" />

        <p className="text-xs font-medium leading-5 text-orange-100/85">
          Localhost test detected. Results may show local server speed, not real
          ISP speed.
        </p>
      </div>
    </div>
  );
});

LocalhostWarning.displayName = "LocalhostWarning";

/* ─── Status Badge ────────────────────────────────────────── */

const StatusBadge = React.memo(({ loaded, testState, color, engineError }) => {
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
          <div className="animate-spin-fast h-3.5 w-3.5 rounded-full border-2 border-white/10 border-t-[#15E28B]" />
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
            boxShadow: `0 0 18px ${color}14`,
          }}
        >
          <span
            className="animate-pulse-indicator block h-2.5 w-2.5 rounded-full"
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
});

StatusBadge.displayName = "StatusBadge";

/* ─── Speed Dial ──────────────────────────────────────────── */

function SpeedDial({
  speed = 0,
  dialMax = 100,
  phase = -1,
  isRunning = false,
  onStart,
  onStop,
  disabled = false,
}) {
  const info = PHASES[phase] ?? PHASES["-1"];
  const color = info.color;
  const showStart = !isRunning && (phase === -1 || phase === 4 || phase === 5);

  const size = 320;
  const center = size / 2;
  const radius = 122;
  const tickRadiusInner = 135;
  const tickRadiusOuter = 143;
  const textRadius = 162;

  const angleStart = -120;
  const angleEnd = 120;
  const angleSweep = angleEnd - angleStart;

  const trackCircumference = 2 * Math.PI * radius;
  const trackArcLength = (angleSweep / 360) * trackCircumference;

  const springConfig = { stiffness: 42, damping: 14, mass: 0.8 };
  const speedSpring = useSpring(0, springConfig);

  useEffect(() => {
    speedSpring.set(Math.min(speed, dialMax));
  }, [speed, dialMax, speedSpring]);

  const needleRotation = useTransform(
    speedSpring,
    [0, dialMax],
    [angleStart, angleEnd]
  );

  const trackDashoffset = useTransform(
    speedSpring,
    [0, dialMax],
    [trackArcLength, 0]
  );

  const [displayValue, setDisplayValue] = useState("0.0");

  useEffect(() => {
    const unsubscribe = speedSpring.on("change", (v) => {
      setDisplayValue(v < 10 && v > 0 ? v.toFixed(2) : v.toFixed(1));
    });

    return unsubscribe;
  }, [speedSpring]);

  const ticks = Array.from({ length: 25 }).map((_, i) => {
    const isMajor = i % 6 === 0;
    const value = Math.round((i / 24) * dialMax);
    const angle = angleStart + (i / 24) * angleSweep;

    const p1 = polarToCartesian(center, center, tickRadiusInner, angle);
    const p2 = polarToCartesian(
      center,
      center,
      isMajor ? tickRadiusOuter + 4 : tickRadiusOuter,
      angle
    );

    const textPos = polarToCartesian(center, center, textRadius, angle);

    return {
      id: i,
      isMajor,
      value,
      p1,
      p2,
      textPos,
    };
  });

  return (
    <div className="relative mx-auto flex h-[330px] w-[330px] select-none items-center justify-center font-sans sm:h-[380px] sm:w-[380px]">
      <div
        className="pointer-events-none absolute inset-6 rounded-full opacity-10 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: color }}
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="needleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="78%" stopColor={color} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        <g className="opacity-55">
          {ticks.map((tick) => (
            <React.Fragment key={`tick-${tick.id}`}>
              <line
                x1={tick.p1.x}
                y1={tick.p1.y}
                x2={tick.p2.x}
                y2={tick.p2.y}
                stroke={
                  tick.isMajor
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.25)"
                }
                strokeWidth={tick.isMajor ? 2 : 1}
                strokeLinecap="round"
              />

              {tick.isMajor && (
                <text
                  x={tick.textPos.x}
                  y={tick.textPos.y}
                  fill="rgba(255,255,255,0.55)"
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-mono tracking-tighter"
                >
                  {tick.value}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${trackArcLength} ${trackCircumference}`}
          transform={`rotate(${angleStart - 90} ${center} ${center})`}
        />

        <circle
          cx={center}
          cy={center}
          r={radius - 8}
          fill="none"
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="1"
          strokeDasharray={`${trackArcLength - 15} ${trackCircumference}`}
          transform={`rotate(${angleStart - 90} ${center} ${center})`}
        />

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${trackArcLength} ${trackCircumference}`}
          style={{ strokeDashoffset: trackDashoffset }}
          transform={`rotate(${angleStart - 90} ${center} ${center})`}
          filter="url(#neonGlow)"
          className="transition-colors duration-500"
        />

        <motion.g
          style={{
            rotate: needleRotation,
            transformOrigin: `${center}px ${center}px`,
          }}
        >
          <polygon
            points={`${center - 3.5},${center + 13} ${center + 3.5},${
              center + 13
            } ${center},${center - radius + 18}`}
            fill="url(#needleGradient)"
            className="transition-colors duration-500"
          />

          <circle
            cx={center}
            cy={center - radius + 16}
            r="2.8"
            fill="#ffffff"
            filter="url(#neonGlow)"
          />

          <circle cx={center} cy={center} r="17" fill="#0b1020" />
          <circle
            cx={center}
            cy={center}
            r="17"
            fill="rgba(255,255,255,0.08)"
          />
        </motion.g>
      </svg>

      <motion.button
        type="button"
        disabled={disabled}
        onClick={isRunning ? onStop : onStart}
        className="relative z-10 flex h-[170px] w-[170px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-white/10 backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-50 sm:h-[190px] sm:w-[190px]"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(6,10,22,0.62) 65%, rgba(0,0,0,0.9) 100%)",
          boxShadow: `0 18px 38px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.17), 0 0 24px ${
            isRunning ? info.glow : "rgba(0,0,0,0)"
          }`,
        }}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {showStart ? (
            <motion.div
              key="start"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner">
                {phase === 4 || phase === 5 ? (
                  <RotateCcw size={25} className="text-white/80" />
                ) : (
                  <Play size={25} className="ml-1 text-white/80" />
                )}
              </div>

              <div className="text-center">
                <span className="block text-xs font-black uppercase tracking-[0.2em] text-white/80">
                  {phase === 4 || phase === 5 ? "Run Again" : "Start Test"}
                </span>

                <span className="mt-1 block text-[10px] font-medium uppercase tracking-widest text-white/38">
                  Tap to begin
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="speed"
              className="flex flex-col items-center px-4 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.23em]"
                style={{ color }}
              >
                {phase !== 0 && <Activity size={12} />}
                {info.label}
              </motion.div>

              <div className="text-4xl font-black leading-none tracking-tighter text-white tabular-nums drop-shadow-md sm:text-5xl">
                {displayValue}
              </div>

              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/38">
                Mbps
              </span>

              {isRunning && (
                <motion.div
                  className="absolute bottom-5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/32 transition-colors hover:text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <Square size={8} className="fill-current" />
                  Stop
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

const MiniMetric = React.memo(
  ({ label, value, unit, icon: Icon, active, color, isValid = true }) => {
    return (
      <motion.div
        className="relative overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-xl"
        style={{
          background: active
            ? `linear-gradient(135deg, ${color}16, rgba(255,255,255,0.035))`
            : "rgba(255,255,255,0.035)",
          borderColor: active ? `${color}50` : "rgba(255,255,255,0.09)",
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
                background: active ? `${color}1F` : "rgba(255,255,255,0.055)",
                borderColor: active ? `${color}40` : "rgba(255,255,255,0.1)",
              }}
            >
              <Icon
                size={16}
                style={{ color: active ? color : "rgba(255,255,255,0.45)" }}
              />
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
                    isValid={isValid}
                    fmt={(v) =>
                      v < 10 && v > 0 ? v.toFixed(2) : v.toFixed(1)
                    }
                  />
                </span>

                <span className="pb-0.5 text-[10px] font-bold uppercase text-white/35">
                  {isValid ? unit : ""}
                </span>
              </div>
            </div>
          </div>

          {active && (
            <span
              className="animate-pulse-indicator h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
      </motion.div>
    );
  }
);

MiniMetric.displayName = "MiniMetric";

/* ─── Step Bar ─────────────────────────────────────────────── */

const StepBar = React.memo(({ testState }) => {
  const steps = [
    { id: 2, label: "Ping", icon: Activity },
    { id: 1, label: "Download", icon: ArrowDown },
    { id: 3, label: "Upload", icon: ArrowUp },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-xl">
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
});

StepBar.displayName = "StepBar";

/* ─── Result Box ───────────────────────────────────────────── */

const ResultBox = React.memo(
  ({ testState, dlVal, ulVal, pingVal, isLocalhost }) => {
    if (testState !== 4) return null;

    let label = "Good Connection";
    let description = "Your network looks stable for browsing and daily work.";

    if (isLocalhost) {
      label = "Localhost Result";
      description =
        "This is not your real ISP speed because the backend is running locally.";
    } else if (dlVal >= 200 && ulVal >= 50 && pingVal <= 30) {
      label = "Excellent Connection";
      description = "Great for 4K streaming, gaming, meetings and cloud work.";
    } else if (dlVal < 25 || pingVal > 100) {
      label = "Needs Attention";
      description = "Your connection may feel slow for calls, uploads or gaming.";
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/[0.07] p-4 backdrop-blur-xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#15E28B]/25 bg-[#15E28B]/10">
            <ShieldCheck size={18} className="text-[#15E28B]" />
          </div>

          <div>
            <h3 className="text-sm font-black text-white">{label}</h3>
            <p className="mt-1 text-xs leading-5 text-white/45">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

ResultBox.displayName = "ResultBox";

/* ─── Info Card ───────────────────────────────────────────── */

const InfoCard = React.memo(({ children }) => {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.028] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-5">
      {children}
    </div>
  );
});

InfoCard.displayName = "InfoCard";

/* ─── SEO Content Section ─────────────────────────────────── */

function SpeedTestGuide() {
  return (
    <section className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#15E28B]">
          Internet Performance Guide
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Understand Your Internet Speed Test Results
        </h2>

        <div className="mt-5 space-y-5 text-sm leading-7 text-white/55 sm:text-base">
          <p>
            AXVOI SpeedTest helps you measure the real performance of your
            internet connection by checking download speed, upload speed, ping,
            jitter, and overall connection stability. These results help you
            understand whether your network is suitable for browsing, streaming,
            online meetings, gaming, cloud work, and large file transfers.
          </p>

          <p>
            Download speed shows how quickly your connection receives data from
            the internet. It affects video streaming, website loading, software
            updates, file downloads, and daily browsing. Upload speed shows how
            quickly your connection sends data, which is important for video
            calls, cloud backups, live streaming, and sending large files.
          </p>

          <p>
            Ping measures the response time between your device and the test
            server. Lower ping usually means a faster and more responsive
            connection. Jitter measures how stable that response time is. A
            connection with low jitter is better for online gaming, video
            conferencing, voice calls, and remote work.
          </p>

          <p>
            For the most accurate result, close unnecessary apps, pause
            background downloads, disconnect unused devices, and test using a
            wired Ethernet connection when possible. Wi-Fi results may change
            depending on router distance, walls, signal interference, connected
            devices, and router quality.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Download Speed</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Download speed affects streaming, browsing, file downloads, app
              updates, and how quickly online content loads on your device.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Upload Speed</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Upload speed matters for video meetings, sending files, cloud
              storage, online backups, and live streaming.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Ping</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Ping shows how quickly your device gets a response from the
              server. Lower ping gives a smoother real-time experience.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Jitter</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Jitter shows how stable your ping is. Lower jitter is better for
              gaming, calls, meetings, and live communication.
            </p>
          </div>
        </div>
      </div>
    </section>
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
    const timer = setTimeout(() => {
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
    }, 300);

    return () => {
      clearTimeout(timer);

      const existingScript = document.querySelector('script[src="/speedtest.js"]');
      if (existingScript) {
        existingScript.remove();
      }

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

    s.setParameter("url_dl", "/api/speedtest/garbage");
    s.setParameter("url_ul", "/api/speedtest/empty");
    s.setParameter("url_ping", "/api/speedtest/ping");
    s.setParameter("url_getIp", "/api/speedtest/ip");

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

  const pingValid = hasValidNumber(liveData?.pingStatus);
  const jitterValid = hasValidNumber(liveData?.jitterStatus);
  const dlValid = hasValidNumber(liveData?.dlStatus);
  const ulValid = hasValidNumber(liveData?.ulStatus);

  const pingVal = safeNumber(liveData?.pingStatus);
  const jitterVal = safeNumber(liveData?.jitterStatus);
  const dlVal = safeNumber(liveData?.dlStatus);
  const ulVal = safeNumber(liveData?.ulStatus);

  const dialMax = useMemo(
    () => getDialMax(Math.max(speed, dlVal, ulVal)),
    [speed, dlVal, ulVal]
  );

  return (
    <div className="relative w-full overflow-x-hidden bg-[#030813] text-white selection:bg-[#15E28B]/20">
      <AmbientBg color={color} />

      <section className="relative z-10 flex min-h-[calc(100svh-86px)] w-full items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 xl:grid-cols-[340px_1fr_340px]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="order-2 space-y-4 xl:order-1"
          >
            <InfoCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10 shadow-[0_0_20px_rgba(21,226,139,0.13)]">
                  <Gauge size={21} className="text-[#15E28B]" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#15E28B]">
                    AXVOI SpeedTest
                  </p>

                  <h2 className="mt-1 text-lg font-black text-white">
                    Network Diagnostics
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Measure your internet speed, ping, upload and connection
                stability in real time.
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
                    Adaptive scale for accurate reading
                  </span>
                </div>
              </div>
            </InfoCard>

            {isLocalhost && <LocalhostWarning />}
          </motion.aside>

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
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Internet Speed Test
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/52 sm:text-base">
                {phaseInfo.description}
              </p>
            </motion.div>

            <div className="mt-2">
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

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="order-3 space-y-4"
          >
            <InfoCard>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.12)]">
                  <Wifi size={21} className="text-sky-400" />
                </div>

                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                    Active Status
                  </h2>

                  <p className="mt-1 text-xl font-black" style={{ color }}>
                    {phaseInfo.label}
                  </p>
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
            </InfoCard>

            <ResultBox
              testState={testState}
              dlVal={dlVal}
              ulVal={ulVal}
              pingVal={pingVal}
              isLocalhost={isLocalhost}
            />
          </motion.aside>

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
              isValid={pingValid}
            />

            <MiniMetric
              label="Jitter"
              value={jitterVal}
              unit="ms"
              icon={Zap}
              active={testState === 2}
              color="#facc15"
              isValid={jitterValid}
            />

            <MiniMetric
              label="Download"
              value={dlVal}
              unit="Mbps"
              icon={ArrowDown}
              active={testState === 1}
              color={COLORS.dl}
              isValid={dlValid}
            />

            <MiniMetric
              label="Upload"
              value={ulVal}
              unit="Mbps"
              icon={ArrowUp}
              active={testState === 3}
              color={COLORS.ul}
              isValid={ulValid}
            />
          </motion.div>
        </div>
      </section>

      <SpeedTestGuide />

      <SpeedTestFAQ />
    </div>
  );
}
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Gauge,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  Signal,
  Square,
  Zap,
} from "lucide-react";
import SpeedTestFAQ from "@/components/SpeedTestFAQ";
import SpeedTestSeoArticle from "@/components/SpeedTestSeoArticle";

// ─── Constants ──────────────────────────────────────────────────────────────

const COLORS = {
  idle: "#9ca3af",
  ping: "#f97316",
  dl: "#15E28B",
  ul: "#38bdf8",
  done: "#15E28B",
  stopped: "#ef4444",
};

const PHASES = {
  "-1": {
    label: "Ready",
    title: "Internet Speed Test Online",
    description: "Tap the button to begin your speed test.",
    color: COLORS.dl,
    glow: "rgba(21, 226, 139, 0.45)",
  },
  "0": {
    label: "Connecting",
    title: "Preparing Test",
    description: "Connecting to the speed test server…",
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
    description: "Estimating ping and jitter stability.",
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
    description: "Your latest internet speed test results are ready.",
    color: COLORS.done,
    glow: "rgba(21, 226, 139, 0.45)",
  },
  "5": {
    label: "Stopped",
    title: "Test Stopped",
    description: "You can start a new speed test anytime.",
    color: COLORS.stopped,
    glow: "rgba(239, 68, 68, 0.45)",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "" || value === "..." || value === "NaN") {
    return fallback;
  }
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function hasValidNumber(value) {
  if (value === null || value === undefined || value === "" || value === "..." || value === "NaN") {
    return false;
  }
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0;
}

function estimateLocalPing({ serverPing, downloadSpeed, uploadSpeed }) {
  const ping = Number(serverPing) || 0;
  const dl = Number(downloadSpeed) || 0;
  const ul = Number(uploadSpeed) || 0;
  if (!ping || ping <= 0) return null;

  let estimate = ping;
  if (ping > 250) estimate = ping * 0.12;
  else if (ping > 180) estimate = ping * 0.18;
  else if (ping > 120) estimate = ping * 0.28;
  else if (ping > 80) estimate = ping * 0.45;

  if (dl >= 100 && ul >= 30) estimate *= 0.75;
  else if (dl >= 50 && ul >= 15) estimate *= 0.9;
  else if (dl < 15 || ul < 5) estimate *= 1.25;

  return Math.max(4, Math.min(estimate, 95));
}

function estimateJitter({ estimatedPing, serverJitter }) {
  const ping = Number(estimatedPing) || 0;
  const jitter = Number(serverJitter) || 0;
  if (!ping) return null;

  let estimate = jitter > 0 ? jitter * 0.2 : ping * 0.12;
  if (ping <= 20) estimate = Math.min(estimate, 6);
  else if (ping <= 50) estimate = Math.min(estimate, 12);
  else estimate = Math.min(estimate, 25);

  return Math.max(1, estimate);
}

function getDialMax(speed) {
  const current = Number(speed) || 0;
  if (current <= 50) return 100;
  return Math.max(100, Math.ceil((current + 50) / 50) * 50);
}

// ─── AmbientBg ───────────────────────────────────────────────────────────────
// FIX: Changed from `fixed` to `absolute` so it doesn't cause scroll repaints
// and is scoped to the section rather than the whole viewport.
function AmbientBg({ color }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-10 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ─── InfoCard ────────────────────────────────────────────────────────────────
function InfoCard({ children }) {
  return (
    <div className="glass-panel w-full rounded-2xl p-6 sm:p-8">
      {children}
    </div>
  );
}

// ─── LocalhostWarning ────────────────────────────────────────────────────────
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

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ loaded, testState, color, engineError }) {
  return (
    <AnimatePresence mode="wait">
      {engineError ? (
        <motion.div
          key="engine-error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2"
        >
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-700">
            Engine Failed
          </span>
        </motion.div>
      ) : !loaded ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 backdrop-blur-md"
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-[#15E28B]" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted)]">
            Loading
          </span>
        </motion.div>
      ) : (
        <motion.div
          key={`status-${testState}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 backdrop-blur-md"
          style={{ boxShadow: `0 2px 8px ${color}15` }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted)]">
            {PHASES[testState]?.label ?? "Ready"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SpeedDial ────────────────────────────────────────────────────────────────
function SpeedDial({
  speed = 0,
  pingValue = 0,
  dialMax = 100,
  phase = -1,
  isRunning = false,
  onStart,
  disabled = false,
  compact = false,
}) {
  const info = PHASES[phase] ?? PHASES["-1"];
  const color = info.color;

  const showSpeed = isRunning && (phase === 1 || phase === 3);
  const showPing = isRunning && phase === 2;

  let centerValue = "";
  let centerUnit = "";

  if (showSpeed && speed > 0) {
    centerValue = speed < 10 ? speed.toFixed(2) : speed.toFixed(1);
    centerUnit = "Mbps";
  } else if (showPing && pingValue > 0) {
    centerValue = Math.round(pingValue).toString();
    centerUnit = "ms";
  }

  const showStartButton = !isRunning && phase === -1;
  const showRetryButton = !isRunning && (phase === 4 || phase === 5);

  const CX = 160;
  const CY = 150;
  const RADIUS = 112;
  const START_CLOCK = 225;
  const SWEEP_DEG = 270;
  const END_CLOCK = START_CLOCK + SWEEP_DEG;

  const percent =
    showSpeed && speed > 0
      ? Math.min(100, Math.max(0, (speed / dialMax) * 100))
      : 0;

  function clockToXY(cx, cy, r, clockDeg) {
    const rad = ((clockDeg - 90) * Math.PI) / 180;

    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function arcPath(cx, cy, r, startClock, endClock) {
    const s = clockToXY(cx, cy, r, startClock);
    const e = clockToXY(cx, cy, r, endClock);
    const span = endClock - startClock;
    const large = span > 180 ? 1 : 0;

    return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
  }

  const trackPath = arcPath(CX, CY, RADIUS, START_CLOCK, END_CLOCK);

  const ticks = [0, 25, 50, 75, 100].map((pct) => {
    const angle = START_CLOCK + (pct / 100) * SWEEP_DEG;
    const outer = clockToXY(CX, CY, RADIUS + 8, angle);
    const inner = clockToXY(CX, CY, RADIUS - 4, angle);
    const lbl = clockToXY(CX, CY, RADIUS + 22, angle);
    const val = Math.round((pct / 100) * dialMax);

    return {
      outer,
      inner,
      lbl,
      val,
      pct,
    };
  });

  return (
    <div className={`relative mx-auto flex w-full select-none flex-col items-center font-sans ${compact ? "max-w-[320px]" : "max-w-[360px]"}`}>
      <div className={`relative flex w-full items-center justify-center rounded-[2rem] border border-[var(--border)] bg-white shadow-sm ${compact ? "h-[300px]" : "h-[320px]"}`}>
        <svg
          viewBox="0 0 320 285"
          className={compact ? "h-[270px] w-[300px]" : "h-[285px] w-[320px]"}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="activeGradCompact"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>

          <path
            d={trackPath}
            fill="none"
            stroke="rgba(17,24,39,0.08)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          <path
            d={trackPath}
            fill="none"
            stroke="url(#activeGradCompact)"
            strokeWidth="11"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - percent}
            className="transition-all duration-500 ease-out"
            style={{ opacity: percent > 0 ? 1 : 0 }}
          />

          {ticks.map((t) => (
            <g key={t.pct}>
              <line
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
                stroke="rgba(17,24,39,0.14)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              <text
                x={t.lbl.x}
                y={t.lbl.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fill="rgba(17,24,39,0.35)"
                fontFamily="monospace"
              >
                {t.val}
              </text>
            </g>
          ))}
        </svg>

        {/* Center content + action button */}
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
  <div
    className={`mb-2 flex items-center gap-1.5 font-black uppercase tracking-[0.22em] ${compact ? "text-[9px]" : "text-[11px]"}`}
    style={{ color }}
  >
    {phase !== 0 && <Activity size={12} />}
    {info.label}
  </div>

  {centerValue ? (
    <>
      <div className={`font-black leading-none tracking-tighter text-[var(--foreground)] tabular-nums ${compact ? "text-4xl" : "text-5xl"}`}>
        {centerValue}
      </div>

      <span className={`mt-2 font-bold uppercase tracking-widest text-[var(--muted-foreground)] ${compact ? "text-[9px]" : "text-[11px]"}`}>
        {centerUnit}
      </span>
    </>
  ) : null}

  {/* Start button before test */}
  {showStartButton && (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onStart}
      className="pointer-events-auto mt-5 flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-xs font-black uppercase tracking-[0.16em] shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <Play size={14} className="fill-[#15E28B] text-[#15E28B]" />
      <span className="text-[var(--foreground)]">Start Test</span>
    </motion.button>
  )}

  {/* Run again after finish */}
  {showRetryButton && (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onStart}
      className="pointer-events-auto mt-5 flex h-11 min-w-[155px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-xs font-black uppercase tracking-[0.16em] shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <RotateCcw size={14} className="text-[var(--foreground)]" />
      <span className="text-[var(--foreground)]">Run Again</span>
    </motion.button>
  )}
  </div>
</div>
    </div>
  );
}
// ─── MiniMetric ───────────────────────────────────────────────────────────────
// FIX: `isValid` now defaults to false so idle state shows "—" not "0.00"
function MiniMetric({
  label,
  value,
  unit,
  icon: Icon,
  active,
  color,
  isValid = false,
}) {
  const display = isValid
    ? value < 10 && value > 0
      ? value.toFixed(2)
      : value.toFixed(1)
    : "";

  // Subtle colors by default
  const baseBg = `${color}06`;      // 2.3% opacity for idle card bg
  const baseBorder = `${color}18`;  // 9.4% opacity for idle card border
  const activeBg = `${color}0d`;    // 5% opacity for active card bg
  const activeBorder = `${color}55`; // 33% opacity for active card border

  const baseIconBg = `${color}12`;  // 7% opacity for idle icon circle
  const baseIconBorder = `${color}25`; // 14% opacity for idle icon border
  const activeIconBg = `${color}22`; // 13.3% opacity for active icon circle
  const activeIconBorder = `${color}60`; // 37% opacity for active icon border

  return (
    <motion.div
      className="hero-metric-card relative overflow-hidden rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md"
      style={{
        borderColor: active ? activeBorder : baseBorder,
        backgroundColor: active ? activeBg : baseBg,
        boxShadow: active ? `0 6px 20px -2px ${color}1c` : "none",
      }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            {label}
          </p>

          <div className="mt-4 flex items-end gap-1.5">
            {display ? (
              <>
                <span
                  className="text-2xl font-black leading-none tabular-nums"
                  style={{ color: color }}
                >
                  {display}
                </span>

                <span className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {unit}
                </span>
              </>
            ) : (
              <span
                className="text-sm font-semibold transition-colors duration-300"
                style={{ color: active ? color : "rgba(107, 114, 128, 0.4)" }}
              >
                -
              </span>
            )}
          </div>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
          style={{
            backgroundColor: active ? activeIconBg : baseIconBg,
            borderColor: active ? activeIconBorder : baseIconBorder,
          }}
        >
          <Icon
            size={17}
            style={{ color: active ? color : `${color}cc` }}
            className="transition-colors duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}
// ─── StepBar ──────────────────────────────────────────────────────────────────
// FIX: Steps are ordered by actual test_order (IP → Download → Upload).
// Latency (phase 2) runs as part of the IP phase before Download.
// Active/done states now match the real phase progression.
function StepBar({ testState }) {
  // test_order = "IP_D_U" → IP (ping/latency) → Download → Upload
  const steps = [
    { id: 2, label: "Latency", icon: Activity, activeBg: "bg-orange-500/10", activeText: "text-orange-500", doneText: "text-orange-500/60" },
    { id: 1, label: "Download", icon: ArrowDown, activeBg: "bg-[#15E28B]/10", activeText: "text-[#15E28B]", doneText: "text-[#15E28B]/60" },
    { id: 3, label: "Upload", icon: ArrowUp, activeBg: "bg-sky-500/10", activeText: "text-sky-500", doneText: "text-sky-500/60" },
  ];

  function getStepStatus(stepId) {
    // Phase mapping: 0=connecting, 1=download, 2=latency(ping), 3=upload, 4=done, 5=stopped
    if (testState === 4) return "done"; // all done
    if (testState === stepId) return "active";

    // Mark as done if we've passed it
    // Latency (2) comes before Download (1) in IP_D_U order
    if (stepId === 2 && [1, 3].includes(testState)) return "done";
    if (stepId === 1 && testState === 3) return "done";

    return "pending";
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm">
      {steps.map((step) => {
        const Icon = step.icon;
        const status = getStepStatus(step.id);

        let statusClass = "text-gray-400 bg-gray-50 border border-gray-100/50";
        if (status === "active") {
          statusClass = `${step.activeBg} ${step.activeText} border border-transparent shadow-sm`;
        } else if (status === "done") {
          statusClass = `bg-gray-50/50 ${step.doneText} border border-transparent`;
        }

        return (
          <div
            key={step.id}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${statusClass}`}
          >
            <Icon size={13} style={{ strokeWidth: 3 }} />
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── FinalResultCard ─────────────────────────────────────────────────────────
function FinalResultCard({
  testState,
  dlVal,
  ulVal,
  estimatedPingVal,
  estimatedJitterVal = 0,
  isLocalhost,
  compact = false,
}) {
  if (testState !== 4) return null;

  let label = "Good Connection";
  let description =
    "Stable for browsing, streaming, video calls and daily online work.";
  let tone = {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    icon: "text-[#15E28B]",
    badge: "text-emerald-700 bg-emerald-100 border-emerald-200",
  };

  if (isLocalhost) {
    label = "Localhost Result";
    description = "This may show local server speed, not real ISP speed.";
    tone = {
      border: "border-orange-200",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      icon: "text-orange-500",
      badge: "text-orange-700 bg-orange-100 border-orange-200",
    };
  } else if (dlVal >= 200 && ulVal >= 50 && estimatedPingVal <= 30) {
    label = "Excellent Connection";
    description = "Great for 4K streaming, gaming, meetings and cloud work.";
  } else if (dlVal < 25 || estimatedPingVal > 80 || estimatedJitterVal > 20) {
    label = "Needs Attention";
    description = "May feel slow for calls, uploads, gaming or live work.";
    tone = {
      border: "border-red-200",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      icon: "text-red-500",
      badge: "text-red-700 bg-red-100 border-red-200",
    };
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className={`w-full flex items-center justify-between rounded-2xl border ${tone.border} ${tone.bg} px-4 py-2.5 shadow-sm`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.iconBg}`}
          >
            <ShieldCheck size={20} className={tone.icon} />
          </div>
          <div className="min-w-0 text-left">
            <h3 className="text-sm font-black leading-tight text-[var(--foreground)]">
              {label}
            </h3>
            <p className="text-[11px] leading-normal text-[var(--muted)] truncate max-w-[280px]">
              {description}
            </p>
          </div>
        </div>
        <div
          className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] ${tone.badge} shrink-0`}
        >
          Result
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`w-full h-full flex flex-col justify-center rounded-[2rem] border ${tone.border} ${tone.bg} p-6 sm:p-8 shadow-sm`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone.iconBg}`}
        >
          <ShieldCheck size={28} className={tone.icon} />
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <div
            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${tone.badge}`}
          >
            Final Result
          </div>

          <h3 className="mt-3 text-2xl font-black leading-tight text-[var(--foreground)]">
            {label}
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
// ─── SpeedTestGuide ───────────────────────────────────────────────────────────
function SpeedTestGuide() {
  return (
    <section className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-5xl rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
          Internet Performance Guide
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
          Understand Your Internet Speed Test Results
        </h2>

        <div className="mt-5 space-y-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
          <p>
            AXVOI SpeedTest is a fast internet speed test online tool that helps you check your
            download speed, upload speed, ping, latency, jitter, bandwidth and overall network
            stability in seconds.
          </p>
          <p>
            You can use this speed test to check WiFi speed, broadband speed, modem speed, wireless
            speed and your complete internet connection performance from one clean dashboard.
          </p>
          <p>
            If you are searching for &quot;what&apos;s my internet speed&quot;, &quot;check my internet speed&quot;,
            &quot;how to test internet speed&quot;, or &quot;how to check WiFi speed&quot;, AXVOI gives you simple
            real-time results for your connection.
          </p>
          <p>
            For more accurate results, close background downloads, pause video streaming, disconnect
            unused devices and test near your WiFi router or with an Ethernet cable.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Download Speed Test",
              body: "Download speed affects streaming, browsing, file downloads, app updates and how quickly online content loads on your device.",
            },
            {
              title: "Upload Speed Test",
              body: "Upload speed matters for video meetings, sending files, cloud storage, online backups and live streaming.",
            },
            {
              title: "Ping and Latency Test",
              body: "Ping and latency show how quickly your device communicates with a server. Lower latency is better for gaming, calls and live work.",
            },
            {
              title: "Jitter and Stability Test",
              body: "Jitter and network stability show how consistent your connection is for video calls, online gaming, meetings and live communication.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <h3 className="text-lg font-black text-[var(--foreground)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="text-lg font-black text-[var(--foreground)]">
            Test Internet Speed with AXVOI SpeedTest
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Run a speed check to measure your internet connection speed, test network speed, check
            broadband performance, measure bandwidth and understand whether your connection is ready
            for streaming, gaming, browsing, downloads, uploads and online work.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── SpeedTestPage ────────────────────────────────────────────────────────────
export default function SpeedTestPage() {
  const [testState, setTestState] = useState(-1);
  const [liveData, setLiveData] = useState(null);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [engineError, setEngineError] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLocalhost(["localhost", "127.0.0.1", "::1"].includes(window.location.hostname));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const s = document.createElement("script");
      s.src = "/speedtest.js";
      s.async = true;
      s.onload = () => { setEngineLoaded(true); setEngineError(false); };
      s.onerror = () => { setEngineLoaded(false); setEngineError(true); };
      document.body.appendChild(s);
    }, 300);

    return () => {
      clearTimeout(timer);
      const existingScript = document.querySelector('script[src="/speedtest.js"]');
      if (existingScript) existingScript.remove();
      if (ref.current) {
        try { ref.current.abort(); } catch {}
        ref.current = null;
      }
    };
  }, []);

  // GSAP animations for premium Hero visual effects
  useEffect(() => {
    let ctx;
    const initHeroAnim = async () => {
      const { gsap } = await import("gsap");

      ctx = gsap.context(() => {
        // 1. Infinitely animate the glowing top line back & forth like a scanner/laser
        gsap.fromTo(
          ".hero-glow-line",
          { xPercent: -100, opacity: 0.3 },
          { 
            xPercent: 100, 
            opacity: 0.9, 
            duration: 4, 
            repeat: -1, 
            yoyo: true, 
            ease: "power1.inOut" 
          }
        );

        // 2. Pulse the background dot-grid like a network heartbeat
        gsap.fromTo(
          ".hero-dot-grid",
          { opacity: 0.22 },
          { 
            opacity: 0.45, 
            duration: 3, 
            repeat: -1, 
            yoyo: true, 
            ease: "sine.inOut" 
          }
        );

        // 3. Stagger entrance of left features
        gsap.fromTo(
          ".hero-feature-pill",
          { opacity: 0, y: 15, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: "back.out(1.7)",
            delay: 0.3 
          }
        );

        // 4. Stagger entrance of the metrics cards on first load
        gsap.fromTo(
          ".hero-metric-card",
          { opacity: 0, x: 25, scale: 0.98 },
          { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power2.out",
            delay: 0.4
          }
        );
      });
    };

    initHeroAnim();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  const pushHistory = useCallback((entry) => {
    try {
      const prev = JSON.parse(localStorage.getItem("axvoi_speedtest_v3") || "[]");
      localStorage.setItem("axvoi_speedtest_v3", JSON.stringify([entry, ...prev].slice(0, 10)));
      window.dispatchEvent(new CustomEvent("speedtest:complete"));
    } catch {}
  }, []);

  const startTest = useCallback(() => {
    if (!window.Speedtest) {
      setEngineError(true);
      return;
    }

    if (ref.current) {
      try { ref.current.abort(); } catch {}
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
        const endDl = safeNumber(snap.dlStatus);
        const endUl = safeNumber(snap.ulStatus);
        const serverPing = safeNumber(snap.pingStatus);
        const serverJitter = safeNumber(snap.jitterStatus);
        const endEstimatedPing =
          estimateLocalPing({ serverPing, downloadSpeed: endDl, uploadSpeed: endUl }) || 0;
        const endEstimatedJitter =
          estimateJitter({ estimatedPing: endEstimatedPing, serverJitter }) || 0;

        pushHistory({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          dl: endDl.toFixed(1),
          ul: endUl.toFixed(1),
          ping: endEstimatedPing.toFixed(1),
          jitter: endEstimatedJitter.toFixed(1),
        });
      }

      ref.current = null;
    };

    s.start();
  }, [pushHistory]);

  const stopTest = useCallback(() => {
    try { ref.current?.abort(); } catch {}
    ref.current = null;
    setTestState(5);
  }, []);

  const isRunning = testState >= 0 && testState <= 3;
  const phaseInfo = PHASES[testState] ?? PHASES["-1"];
  const color = phaseInfo.color;

  // FIX: Use hasValidNumber with > 0 guard to prevent 0.00 display on idle
  const serverPingValid = hasValidNumber(liveData?.pingStatus);
  const serverJitterValid = hasValidNumber(liveData?.jitterStatus);
  const dlValid = hasValidNumber(liveData?.dlStatus);
  const ulValid = hasValidNumber(liveData?.ulStatus);

  const serverPingVal = safeNumber(liveData?.pingStatus);
  const serverJitterVal = safeNumber(liveData?.jitterStatus);
  const dlVal = safeNumber(liveData?.dlStatus);
  const ulVal = safeNumber(liveData?.ulStatus);

  const estimatedPingVal = estimateLocalPing({
    serverPing: serverPingVal,
    downloadSpeed: dlVal,
    uploadSpeed: ulVal,
  });

  const estimatedJitterVal = estimateJitter({
    estimatedPing: estimatedPingVal,
    serverJitter: serverJitterVal,
  });

  const estimatedPingValid = serverPingValid && estimatedPingVal !== null;
  const estimatedJitterValid = serverJitterValid && estimatedJitterVal !== null;

  const speed = testState === 1 ? dlVal : testState === 3 ? ulVal : 0;
  const dialMax = useMemo(
    () => getDialMax(Math.max(speed, dlVal, ulVal)),
    [speed, dlVal, ulVal]
  );

  return (
  <div className="relative w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] selection:bg-[#15E28B]/20">
    <section className="relative z-10 min-h-[calc(100svh-86px)] lg:h-[calc(100svh-86px)] h-auto w-full overflow-visible lg:overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <AmbientBg color={color} />

      <div id="speed-test" className="relative z-10 mx-auto flex h-auto lg:h-full w-full max-w-6xl items-center">
        <div 
          className="relative h-auto lg:h-[calc(100%-24px)] w-full rounded-[2rem] border bg-gradient-to-br from-white via-white to-gray-50/40 p-5 sm:p-6 lg:p-6 transition-all duration-1000 ease-in-out overflow-visible lg:overflow-hidden"
          style={{
            borderColor: color === COLORS.idle ? "rgba(21, 226, 139, 0.15)" : `${color}25`,
            boxShadow: `0 12px 40px -12px rgba(0, 0, 0, 0.03), 0 0 70px -15px ${color === COLORS.idle ? "rgba(21, 226, 139, 0.1)" : color}0d`,
          }}
        >
          {/* Glowing Green Top Border Accent Line */}
          <div className="hero-glow-line absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#15E28B] to-transparent opacity-80 z-20 pointer-events-none" />

          {/* Premium Dot-Grid Background Overlay */}
          <div 
            className="hero-dot-grid absolute inset-0 rounded-[2rem] pointer-events-none opacity-[0.35] z-0 transition-all duration-1000" 
            style={{
              backgroundImage: `radial-gradient(${color}1b 1.2px, transparent 1.2px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid h-auto lg:h-full items-stretch gap-6 lg:gap-5 grid-cols-1 lg:grid-cols-[280px_minmax(420px,1fr)_340px]">
            {/* LEFT PANEL */}
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="order-3 lg:order-none flex h-auto lg:h-full flex-col justify-center space-y-4 lg:space-y-6 text-center lg:text-left items-center lg:items-start"
            >
              <div className="flex flex-col items-center lg:items-start">
                <StatusBadge
                  loaded={engineLoaded}
                  testState={testState}
                  color={color}
                  engineError={engineError}
                />

                <h1 className="mt-4 lg:mt-5 text-3xl sm:text-4xl lg:text-4xl font-black leading-tight tracking-tight text-[var(--foreground)]">
                  Internet <span className="text-[#15E28B]">Speed Test</span> Online
                </h1>

                <p className="mt-3 text-sm leading-6 text-[var(--muted)] max-w-md lg:max-w-none">
                  Check download speed, upload speed, ping, jitter, WiFi
                  performance and network stability in seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 w-full">
                <div className="hero-feature-pill flex items-center justify-center lg:justify-start gap-3 rounded-xl border border-[#15E28B]/10 bg-[#15E28B]/05 px-3 py-3 transition hover:bg-[#15E28B]/08">
                  <Server size={16} className="text-[#15E28B]" />
                  <span className="text-xs font-bold text-gray-700">
                    Server-based speed test
                  </span>
                </div>

                <div className="hero-feature-pill flex items-center justify-center lg:justify-start gap-3 rounded-xl border border-sky-500/10 bg-sky-500/5 px-3 py-3 transition hover:bg-sky-500/8">
                  <Signal size={16} className="text-sky-500" />
                  <span className="text-xs font-bold text-gray-700">
                    Smart latency estimation
                  </span>
                </div>
              </div>

              <div className="min-h-0 lg:min-h-[72px] w-full">
                {isLocalhost && testState !== 4 && <LocalhostWarning />}
              </div>
            </motion.aside>

            {/* CENTER COLUMN */}
            <motion.main
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="order-1 lg:order-none flex h-auto lg:h-full flex-col items-center justify-center overflow-visible lg:overflow-hidden py-4 lg:py-0 w-full"
            >
              {testState === 4 ? (
                /* Completed — compact result on top + compact dial centered */
                <div className="flex w-full max-w-[420px] flex-col items-center justify-center gap-4">
                  <FinalResultCard
                    testState={testState}
                    dlVal={dlVal}
                    ulVal={ulVal}
                    estimatedPingVal={estimatedPingVal || 0}
                    estimatedJitterVal={estimatedJitterVal || 0}
                    isLocalhost={isLocalhost}
                    compact={true}
                  />
                  <SpeedDial
                    speed={speed}
                    pingValue={estimatedPingVal || serverPingVal || 0}
                    dialMax={dialMax}
                    phase={testState}
                    isRunning={isRunning}
                    onStart={startTest}
                    disabled={!engineLoaded || engineError}
                    compact={true}
                  />
                  <div className="w-full max-w-[380px] shrink-0">
                    <StepBar testState={testState} />
                  </div>
                </div>
              ) : (
                /* Running / idle — large dial */
                <div className="flex w-full max-w-[420px] flex-col items-center justify-center gap-4">
                  <SpeedDial
                    speed={speed}
                    pingValue={estimatedPingVal || serverPingVal || 0}
                    dialMax={dialMax}
                    phase={testState}
                    isRunning={isRunning}
                    onStart={startTest}
                    disabled={!engineLoaded || engineError}
                  />
                  <div className="w-full max-w-[380px] shrink-0">
                    <StepBar testState={testState} />
                  </div>
                </div>
              )}
            </motion.main>

            {/* RIGHT COLUMN */}
            <motion.aside
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="order-2 lg:order-none flex h-auto lg:h-full flex-col justify-center gap-4 lg:gap-3 overflow-visible lg:overflow-hidden w-full mt-4 lg:mt-0"
            >
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 w-full">
                <MiniMetric
                  label={testState === 4 ? "Ping" : "Estimated Ping"}
                  value={estimatedPingVal || 0}
                  unit="ms"
                  icon={Activity}
                  active={testState === 4 || testState === 2}
                  color={COLORS.ping}
                  isValid={estimatedPingValid}
                />
                <MiniMetric
                  label={testState === 4 ? "Jitter" : "Est. Jitter"}
                  value={estimatedJitterVal || 0}
                  unit="ms"
                  icon={Zap}
                  active={testState === 4 || testState === 2}
                  color="#f59e0b"
                  isValid={estimatedJitterValid}
                />
                <MiniMetric
                  label="Download"
                  value={dlVal}
                  unit="Mbps"
                  icon={ArrowDown}
                  active={testState === 4 || testState === 1}
                  color={COLORS.dl}
                  isValid={dlValid}
                />
                <MiniMetric
                  label="Upload"
                  value={ulVal}
                  unit="Mbps"
                  icon={ArrowUp}
                  active={testState === 4 || testState === 3}
                  color={COLORS.ul}
                  isValid={ulValid}
                />
              </div>
              <p className="min-h-0 lg:min-h-[40px] text-center text-xs leading-5 text-gray-500 mt-2 lg:mt-0">
                {testState === 4
                  ? "Test completed successfully using AXVOI network servers."
                  : "Ping and jitter are estimated using AXVOI server latency and connection performance."}
              </p>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>

    <SpeedTestGuide />
    <SpeedTestSeoArticle />
    <SpeedTestFAQ />
    <MoreToolsSection />
    <ToolsCtaBanner />
  </div>
  );
}

function MoreToolsSection() {
  const tools = [
    {
      title: "Brat Generator",
      description: "Create brat-style green text, album covers, memes, and PNG images online for free.",
      link: "https://axvoi.com/tools/brat-generator",
      btnText: "Open Brat Generator",
    },
    {
      title: "AXVOI Tools",
      description: "Discover more free online tools for creators, developers, and everyday users.",
      link: "https://axvoi.com/tools",
      btnText: "Explore Tools",
    },
    {
      title: "AXVOI Blog",
      description: "Read helpful guides about AI, technology, websites, apps, and digital tools.",
      link: "https://axvoi.com/blog",
      btnText: "Read Blog",
    },
  ];

  return (
    <section className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[#f9fafb]/50">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
            More Free Tools by <span className="text-[#00df81]">AXVOI</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore other fast, free, and browser-based tools from AXVOI.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:border-[#00df81]/40 hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-black text-[var(--foreground)] group-hover:text-[#00df81] transition-colors flex items-center gap-1.5">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-gray-700 shadow-sm transition hover:border-[#00df81]/30 hover:bg-[#00df81]/10 hover:text-[#022c1a]"
                >
                  {tool.btnText}
                  <span className="opacity-65">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsCtaBanner() {
  return (
    <section className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#00df81]/25 bg-gradient-to-br from-emerald-50/40 via-white to-white p-8 sm:p-10 text-center shadow-sm">
        <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
          Need More Free Online Tools?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
          AXVOI creates simple, fast, and useful web tools for creators, developers, and everyday users.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://axvoi.com/tools"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-[#00df81] px-6 text-xs font-black uppercase tracking-[0.16em] text-[#022c1a] shadow-sm transition hover:bg-[#00c974] active:scale-[0.98]"
          >
            Explore AXVOI Tools
          </a>
          <a
            href="https://axvoi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-xs font-black uppercase tracking-[0.16em] text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
          >
            Visit AXVOI
          </a>
        </div>
      </div>
    </section>
  );
}
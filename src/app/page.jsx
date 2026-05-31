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
  Wifi,
  Zap,
} from "lucide-react";
import SpeedTestFAQ from "@/components/SpeedTestFAQ";
import SpeedTestSeoArticle from "@/components/SpeedTestSeoArticle";

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
    title: "Internet Speed Test Online",
    description:
      "Check your WiFi speed, broadband speed, download speed, upload speed, ping, latency, jitter and network stability instantly.",
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
  else estimate = ping;

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

function AmbientBg({ color }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030813]">
      <div
        className="absolute -left-[14%] -top-[36%] h-[66vw] w-[66vw] rounded-full blur-3xl"
        style={{ backgroundColor: color, opacity: 0.18 }}
      />
      <div className="absolute -bottom-[36%] -right-[14%] h-[58vw] w-[58vw] rounded-full bg-[#15E28B]/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030813]/20 via-[#030813]/76 to-[#030813]" />
    </div>
  );
}

function InfoCard({ children }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.028] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-5">
      {children}
    </div>
  );
}

function LocalhostWarning() {
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
}

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
            boxShadow: `0 0 18px ${color}14`,
          }}
        >
          <span
            className="block h-2.5 w-2.5 animate-pulse rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
            {PHASES[testState]?.label ?? "Ready"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
  const percent = Math.min(100, Math.max(0, (speed / dialMax) * 100));
  const displayValue = speed < 10 && speed > 0 ? speed.toFixed(2) : speed.toFixed(1);

  return (
    <div className="relative mx-auto flex h-[330px] w-[330px] select-none items-center justify-center font-sans sm:h-[380px] sm:w-[380px]">
      <div
        className="pointer-events-none absolute inset-6 rounded-full opacity-10 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: color }}
      />

      <div className="absolute h-[290px] w-[290px] rounded-full border border-white/10 bg-black/20 p-5 shadow-2xl shadow-black/40 sm:h-[330px] sm:w-[330px]">
        <div className="h-full w-full rounded-full border border-white/10 bg-white/[0.025] p-4">
          <div className="relative h-full w-full rounded-full border border-white/10">
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-4 h-[44%] w-1 origin-bottom -translate-x-1/2 rounded-full transition-transform duration-700"
              style={{
                background: `linear-gradient(to top, transparent, ${color}, white)`,
                transform: `translateX(-50%) rotate(${(percent / 100) * 240 - 120}deg)`,
              }}
            />
          </div>
        </div>
      </div>

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
      >
        <AnimatePresence mode="wait">
          {showStart ? (
            <motion.div
              key="start"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
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
            >
              <div
                className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.23em]"
                style={{ color }}
              >
                {phase !== 0 && <Activity size={12} />}
                {info.label}
              </div>
              <div className="text-4xl font-black leading-none tracking-tighter text-white tabular-nums drop-shadow-md sm:text-5xl">
                {displayValue}
              </div>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/38">
                Mbps
              </span>
              {isRunning && (
                <div className="absolute bottom-5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/32">
                  <Square size={8} className="fill-current" />
                  Stop
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function MiniMetric({ label, value, unit, icon: Icon, active, color, isValid = true }) {
  const display = isValid
    ? value < 10 && value > 0
      ? value.toFixed(2)
      : value.toFixed(1)
    : "—";

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
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border"
            style={{
              background: active ? `${color}1F` : "rgba(255,255,255,0.055)",
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
              <span className="text-2xl font-black leading-none tabular-nums" style={{ color: active ? color : "rgba(255,255,255,0.9)" }}>
                {display}
              </span>
              <span className="pb-0.5 text-[10px] font-bold uppercase text-white/35">
                {isValid ? unit : ""}
              </span>
            </div>
          </div>
        </div>
        {active && <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: color }} />}
      </div>
    </motion.div>
  );
}

function StepBar({ testState }) {
  const steps = [
    { id: 2, label: "Latency", icon: Activity },
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
}

function ResultBox({ testState, dlVal, ulVal, estimatedPingVal, isLocalhost }) {
  if (testState !== 4) return null;

  let label = "Good Connection";
  let description = "Your network looks stable for browsing, streaming and daily work.";

  if (isLocalhost) {
    label = "Localhost Result";
    description = "This is not your real ISP speed because the backend is running locally.";
  } else if (dlVal >= 200 && ulVal >= 50 && estimatedPingVal <= 30) {
    label = "Excellent Connection";
    description = "Great for 4K streaming, gaming, meetings and cloud work.";
  } else if (dlVal < 25 || estimatedPingVal > 80) {
    label = "Needs Attention";
    description = "Your connection may feel slow for calls, uploads, gaming, or live work.";
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
          <p className="mt-1 text-xs leading-5 text-white/45">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

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
            AXVOI SpeedTest is a fast internet speed test online tool that helps
            you check your download speed, upload speed, ping, latency, jitter,
            bandwidth and overall network stability in seconds.
          </p>

          <p>
            You can use this speed test to check WiFi speed, broadband speed,
            modem speed, wireless speed and your complete internet connection
            performance from one clean dashboard.
          </p>

          <p>
            If you are searching for “what&apos;s my internet speed”, “check my
            internet speed”, “how to test internet speed”, or “how to check WiFi
            speed”, AXVOI gives you simple real-time results for your connection.
          </p>

          <p>
            For more accurate results, close background downloads, pause video
            streaming, disconnect unused devices and test near your WiFi router
            or with an Ethernet cable.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Download Speed Test</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Download speed affects streaming, browsing, file downloads, app
              updates and how quickly online content loads on your device.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Upload Speed Test</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Upload speed matters for video meetings, sending files, cloud
              storage, online backups and live streaming.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Ping and Latency Test</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Ping and latency show how quickly your device communicates with a
              server. Lower latency is better for gaming, calls and live work.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <h3 className="text-lg font-black text-white">Jitter and Stability Test</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Jitter and network stability show how consistent your connection
              is for video calls, online gaming, meetings and live communication.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#15E28B]/20 bg-[#15E28B]/[0.06] p-5">
          <h3 className="text-lg font-black text-white">
            Test Internet Speed with AXVOI SpeedTest
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Run a speed check to measure your internet connection speed, test
            network speed, check broadband performance, measure bandwidth and
            understand whether your connection is ready for streaming, gaming,
            browsing, downloads, uploads and online work.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function SpeedTestPage() {
  const [testState, setTestState] = useState(-1);
  const [liveData, setLiveData] = useState(null);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [engineError, setEngineError] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocalhost(["localhost", "127.0.0.1", "::1"].includes(window.location.hostname));
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
      if (existingScript) existingScript.remove();

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
      localStorage.setItem("axvoi_speedtest_v3", JSON.stringify([entry, ...prev].slice(0, 10)));
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
    try {
      ref.current?.abort();
    } catch {}
    ref.current = null;
    setTestState(5);
  }, []);

  const isRunning = testState >= 0 && testState <= 3;
  const phaseInfo = PHASES[testState] ?? PHASES["-1"];
  const color = phaseInfo.color;

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
  const dialMax = useMemo(() => getDialMax(Math.max(speed, dlVal, ulVal)), [speed, dlVal, ulVal]);

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
                  <h2 className="mt-1 text-lg font-black text-white">Network Diagnostics</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                Run an internet speed test online to measure download speed,
                upload speed, ping, jitter, bandwidth and connection stability.
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
                    Smart latency estimation
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
            <StatusBadge loaded={engineLoaded} testState={testState} color={color} engineError={engineError} />

            <motion.div
              key={testState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Internet Speed Test Online
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/52 sm:text-base">
                {testState === -1 ? PHASES["-1"].description : phaseInfo.description}
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
                  : "Press the center dial to test your internet speed online."}
              </p>

              <div className="mt-5">
                <StepBar testState={testState} />
              </div>
            </InfoCard>

            <ResultBox
              testState={testState}
              dlVal={dlVal}
              ulVal={ulVal}
              estimatedPingVal={estimatedPingVal || 0}
              isLocalhost={isLocalhost}
            />
          </motion.aside>

          <motion.div
            className="order-4 grid w-full gap-3 sm:grid-cols-2 xl:col-span-3 xl:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          >
            <MiniMetric
              label="Estimated Ping"
              value={estimatedPingVal || 0}
              unit="ms"
              icon={Activity}
              active={testState === 2}
              color={COLORS.ping}
              isValid={estimatedPingValid}
            />
            <MiniMetric
              label="Estimated Jitter"
              value={estimatedJitterVal || 0}
              unit="ms"
              icon={Zap}
              active={testState === 2}
              color="#facc15"
              isValid={estimatedJitterValid}
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

            <p className="text-center text-xs leading-5 text-white/35 sm:col-span-2 xl:col-span-4">
              Ping and jitter are estimated using AXVOI server latency and connection performance.
            </p>
          </motion.div>
        </div>
      </section>

      <SpeedTestGuide />
      <SpeedTestSeoArticle />
      <SpeedTestFAQ />
    </div>
  );
}


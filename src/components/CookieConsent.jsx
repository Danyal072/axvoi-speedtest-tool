"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "axvoi_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't made a choice yet
    if (!localStorage.getItem(CONSENT_KEY)) {
      // Small delay so it doesn't flash on initial paint
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function handleLater() {
    // Session-only dismissal — do NOT write to localStorage
    // Banner will reappear on next visit until the user accepts
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-3 left-3 right-3 z-50 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                  <Cookie size={15} className="text-[#00df81]" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
                  Cookies
                </p>
              </div>

              <button
                type="button"
                onClick={handleLater}
                aria-label="Dismiss cookie consent"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            </div>

            {/* Body */}
            <p className="mt-3 text-[13px] leading-5 text-gray-600">
              We use essential and performance cookies to improve AXVOI SpeedTest. Learn more in our{" "}
              <a
                href="https://axvoi.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#00df81] underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://axvoi.com/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#00df81] underline-offset-2 hover:underline"
              >
                Cookies Policy
              </a>
              .
            </p>

            {/* Buttons */}
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAccept}
                aria-label="Accept cookies"
                className="flex-1 rounded-xl bg-[#00df81] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#022c1a] transition hover:bg-[#00c974] active:scale-[0.98]"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleLater}
                aria-label="Dismiss cookies for now"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-gray-600 transition hover:bg-gray-200 active:scale-[0.98]"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

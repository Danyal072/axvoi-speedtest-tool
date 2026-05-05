"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    id: 1,
    question: "What is AXVOI SpeedTest?",
    answer:
      "AXVOI SpeedTest is a modern internet speed testing tool that helps you check your download speed, upload speed, ping, jitter, and connection stability in real time.",
  },
  {
    id: 2,
    question: "Why should I use AXVOI SpeedTest?",
    answer:
      "AXVOI SpeedTest gives you a clean, fast, and easy way to understand your internet performance without a complicated interface. It is built for users who want quick results with a modern digital dashboard experience.",
  },
  {
    id: 3,
    question: "What does download speed mean?",
    answer:
      "Download speed shows how fast your internet receives data. It affects browsing, streaming, file downloads, online meetings, and app loading speed.",
  },
  {
    id: 4,
    question: "What does upload speed mean?",
    answer:
      "Upload speed shows how fast your internet sends data. It matters for video calls, file uploads, cloud backups, live streaming, and sending large attachments.",
  },
  {
    id: 5,
    question: "What is ping?",
    answer:
      "Ping is the time it takes for your device to send a request to a server and receive a response. Lower ping means faster response time.",
  },
  {
    id: 6,
    question: "What is jitter?",
    answer:
      "Jitter shows how much your ping changes during the test. Lower jitter means a more stable connection, which is better for gaming, video calls, and live meetings.",
  },
  {
    id: 7,
    question: "What is a good internet speed?",
    answer:
      "For normal browsing, 25 Mbps is usually enough. For HD streaming, online meetings, and work, 50–100 Mbps feels smoother. For 4K streaming, gaming, and heavy downloads, 200 Mbps or more is better.",
  },
  {
    id: 8,
    question: "What is a good ping?",
    answer:
      "A ping below 30 ms is excellent. Between 30–60 ms is good for most users. Above 100 ms may feel slow during gaming, calls, or real-time apps.",
  },
  {
    id: 9,
    question: "Why is my speed test result different every time?",
    answer:
      "Internet speed can change because of network traffic, Wi-Fi signal strength, server distance, device performance, background apps, VPN usage, and the number of users connected to the same network.",
  },
  {
    id: 10,
    question: "Is AXVOI SpeedTest accurate?",
    answer:
      "AXVOI SpeedTest is designed to provide real-time performance readings using download, upload, ping, and jitter testing. Like all speed test tools, results may vary depending on server location, network conditions, and device setup.",
  },
  {
    id: 11,
    question: "Why is my Wi-Fi speed slower than my internet package?",
    answer:
      "Wi-Fi speed can be affected by distance from the router, walls, signal interference, old router hardware, too many connected devices, or using a slower Wi-Fi band.",
  },
  {
    id: 12,
    question: "Should I test on Wi-Fi or cable?",
    answer:
      "For the most accurate result, use a wired Ethernet connection. Wi-Fi testing is useful for checking your daily experience, but wired testing is better for comparing with your internet package.",
  },
  {
    id: 13,
    question: "Does AXVOI SpeedTest work on mobile?",
    answer:
      "Yes. AXVOI SpeedTest is designed to work on desktop, tablet, and mobile screens with a responsive interface.",
  },
  {
    id: 14,
    question: "Can I use AXVOI SpeedTest to check gaming performance?",
    answer:
      "Yes. For gaming, focus on ping and jitter more than download speed. Low ping and low jitter usually mean smoother gameplay.",
  },
  {
    id: 15,
    question: "Can AXVOI SpeedTest help with video call problems?",
    answer:
      "Yes. If your video calls freeze, lag, or disconnect, check your upload speed, ping, and jitter. Weak upload speed or unstable jitter can affect meeting quality.",
  },
  {
    id: 16,
    question: "Why does the test show a localhost warning?",
    answer:
      "If you run AXVOI SpeedTest locally during development, results may show local server performance instead of real ISP speed. For realistic results, deploy the app on a proper server.",
  },
  {
    id: 17,
    question: "Does AXVOI SpeedTest save my results?",
    answer:
      "AXVOI SpeedTest may save recent test results in your browser's local storage if the feature is enabled. This helps you compare recent performance on the same device.",
  },
  {
    id: 18,
    question: "Can I clear my saved speed test history?",
    answer:
      "Yes. You can clear saved results by clearing your browser site data for the AXVOI SpeedTest website.",
  },
  {
    id: 19,
    question: "Does AXVOI SpeedTest collect personal data?",
    answer:
      "AXVOI SpeedTest is mainly built to measure network performance. If analytics or result history is enabled, the website owner should clearly explain what is collected in the privacy policy.",
  },
  {
    id: 20,
    question: "Why does server location matter?",
    answer:
      "A nearby server usually gives better ping and faster results. A far server may show higher latency and lower speed, even if your internet connection is good.",
  },
  {
    id: 21,
    question: "Can I compare AXVOI SpeedTest with other speed test tools?",
    answer:
      "Yes. You can compare results, but every speed test tool may use different servers, test methods, and network routes. Small differences are normal.",
  },
  {
    id: 22,
    question: "Why is upload speed usually lower than download speed?",
    answer:
      "Many internet plans are designed with higher download speed and lower upload speed because most users download more data than they upload.",
  },
  {
    id: 23,
    question: "What can I do if my speed is slow?",
    answer:
      "Restart your router, move closer to Wi-Fi, disconnect unused devices, close background downloads, test with Ethernet, disable VPN temporarily, and contact your ISP if the speed stays much lower than your package.",
  },
  {
    id: 24,
    question: "Can VPN affect speed test results?",
    answer:
      "Yes. A VPN can reduce speed and increase ping because your traffic passes through an extra server.",
  },
  {
    id: 25,
    question: "Can too many devices affect my internet speed?",
    answer:
      "Yes. Phones, TVs, laptops, smart cameras, gaming consoles, and background downloads can all reduce available bandwidth.",
  },
  {
    id: 26,
    question: "Is AXVOI SpeedTest free to use?",
    answer:
      "AXVOI SpeedTest can be offered as a free web tool depending on the website owner's setup and hosting plan.",
  },
  {
    id: 27,
    question: "Can I use AXVOI SpeedTest API in another app?",
    answer:
      "If API access is enabled and your domain is allowed through CORS configuration, you can connect another frontend or app to the AXVOI SpeedTest backend routes.",
  },
  {
    id: 28,
    question: "Why does CORS matter for AXVOI SpeedTest API?",
    answer:
      "CORS controls which websites are allowed to call the SpeedTest API from a browser. This helps prevent unwanted use from unknown domains.",
  },
  {
    id: 29,
    question: "Can AXVOI SpeedTest be embedded into another website?",
    answer:
      "Yes, it can be integrated into another website if the app owner allows cross-origin access or provides an approved integration method.",
  },
  {
    id: 30,
    question: "Who is AXVOI SpeedTest best for?",
    answer:
      "AXVOI SpeedTest is useful for everyday internet users, remote workers, gamers, streamers, web developers, agencies, support teams, and anyone who wants to quickly check connection quality.",
  },
];

const FAQItem = React.memo(({ item, isOpen, onToggle }) => {
  return (
    <motion.div
      className="overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-200"
      style={{
        background: isOpen
          ? "linear-gradient(135deg, rgba(21,226,139,0.08), rgba(255,255,255,0.02))"
          : "rgba(255,255,255,0.035)",
        borderColor: isOpen ? "rgba(21,226,139,0.35)" : "rgba(255,255,255,0.1)",
        boxShadow: isOpen
          ? "0 0 28px rgba(21,226,139,0.12), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "none",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full px-4 py-4 text-left sm:px-6 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15E28B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030813]"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold leading-6 text-white sm:text-base">
            {item.question}
          </h3>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="shrink-0"
          >
            <ChevronDown
              size={20}
              className="text-[#15E28B] transition-colors duration-200"
            />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-white/10"
          >
            <div className="px-4 py-4 text-sm leading-7 text-white/70 sm:px-6 sm:py-5 sm:text-base">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FAQItem.displayName = "FAQItem";

export default function SpeedTestFAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative z-10 w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow & Heading */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <div className="mb-3 flex items-center justify-center gap-2">
            <HelpCircle size={18} className="text-[#15E28B]" />
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#15E28B]">
              AXVOI Help Center
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
            Everything you need to know about internet speed, ping, jitter, Wi-Fi
            performance, and AXVOI SpeedTest.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-3 sm:space-y-4">
          {FAQ_DATA.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.028] p-6 text-center backdrop-blur-2xl sm:mt-16 sm:p-8"
        >
          <p className="text-sm text-white/70 sm:text-base">
            Can't find what you're looking for?{" "}
            <span className="text-[#15E28B]">
              Test your connection and explore results for more insights.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

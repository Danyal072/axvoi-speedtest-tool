import {
  ShieldCheck,
  EyeOff,
  BarChart3,
  Cookie,
  Globe,
  Server,
  Mail,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy — AXVOI SpeedTest by AXVOI",
  description:
    "Privacy Policy for AXVOI SpeedTest by AXVOI. Learn how the tool works, what it does not collect, and how Google Analytics may be used.",
};

const SECTIONS = [
  {
    title: "1. Overview",
    content:
      "AXVOI SpeedTest is a free internet speed testing tool by AXVOI. The tool is designed to help users check estimated download speed, upload speed, ping, and jitter. By default, AXVOI SpeedTest does not require users to create an account, sign in, or submit personal information.",
  },
  {
    title: "2. Data We Do Not Collect by Default",
    content:
      "AXVOI SpeedTest does not collect names, email addresses, phone numbers, passwords, payment details, documents, exact home addresses, or any information that users directly submit through a registration form. The core speed test tool is designed to run without asking for personal user data.",
  },
  {
    title: "3. Speed Test Measurements",
    content:
      "When you run a speed test, the tool measures technical network performance such as download speed, upload speed, ping, and jitter. These measurements are shown to you in your browser. The tool may temporarily process request information required to complete the test, but it is not designed to identify you personally.",
  },
  {
    title: "4. IP Address and ISP Information",
    content:
      "LibreSpeed-based testing may use your IP address only for technical purposes such as showing network or ISP-related information and completing the test process. This information is used for diagnostics and display purposes, not to create personal user profiles inside AXVOI SpeedTest.",
  },
  {
    title: "5. Local Browser History",
    content:
      "If the tool shows recent test history, that history is stored locally in your own browser using localStorage. This means the data remains on your device/browser and is not submitted to AXVOI by default. You can clear it by clearing your browser site data.",
  },
  {
    title: "6. Google Analytics",
    content:
      "AXVOI may use Google Analytics to understand general website usage, such as page views, device type, browser type, approximate location, traffic source, and user interactions. Google Analytics helps us improve the website experience. Google Analytics may use cookies or similar technologies depending on your browser settings and regional consent requirements.",
  },
  {
    title: "7. Cookies and Similar Technologies",
    content:
      "The core speed test tool does not need cookies to measure your internet speed. However, Google Analytics may use cookies or similar technologies to provide website usage statistics. You can control or block cookies through your browser settings.",
  },
  {
    title: "8. Third-Party Services",
    content:
      "AXVOI SpeedTest may rely on third-party technologies, including LibreSpeed for speed testing functionality and Google Analytics for website analytics. These third-party services may process limited technical information according to their own policies and configurations.",
  },
  {
    title: "9. Data Sharing",
    content:
      "AXVOI does not sell personal data collected through AXVOI SpeedTest. Since the tool does not collect personal information by default, there is no user account data or registration data to sell. Analytics data may be processed by Google Analytics according to Google’s own service terms and privacy practices.",
  },
  {
    title: "10. Data Security",
    content:
      "We aim to keep the service secure and reliable. However, no website or online service can be guaranteed to be completely secure. Users should avoid entering personal or sensitive information into any tool or page unless it is specifically required and clearly explained.",
  },
  {
    title: "11. Children’s Privacy",
    content:
      "AXVOI SpeedTest is a general network diagnostic tool and is not intended to knowingly collect personal information from children. Since the tool does not require account creation or personal data submission, it is not designed to collect personal information from minors.",
  },
  {
    title: "12. Your Choices",
    content:
      "You can disable cookies, block analytics scripts, use browser privacy controls, clear localStorage, or clear site data at any time. If you do not want Google Analytics to process usage information, you may use browser settings, privacy extensions, or Google’s available opt-out tools.",
  },
  {
    title: "13. Changes to This Policy",
    content:
      "AXVOI may update this Privacy Policy from time to time to reflect changes in the tool, analytics setup, legal requirements, or website operations. The updated version will be posted on this page with a revised update date.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030813] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-44 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#15E28B]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-sky-400/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#15E28B]/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030813]/30 via-[#030813]/85 to-[#030813]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-[#15E28B]/10 shadow-[0_0_30px_rgba(21,226,139,0.18)]">
            <ShieldCheck size={30} className="text-[#15E28B]" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/20 bg-[#15E28B]/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#15E28B]">
            AXVOI Privacy Notice
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">
            AXVOI SpeedTest by AXVOI is designed to measure internet
            performance without asking users for personal information. This
            policy explains what the tool does not collect, how speed testing
            works, and how Google Analytics may be used.
          </p>

          <p className="mt-4 text-sm text-white/35">
            Last updated: January 2026
          </p>
        </div>

        {/* Privacy Summary Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <EyeOff size={25} className="text-[#15E28B]" />
            <h2 className="mt-4 text-lg font-black text-white">
              No User Account Data
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              The tool does not require sign-up, login, name, email, phone
              number, or payment details.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <Server size={25} className="text-sky-400" />
            <h2 className="mt-4 text-lg font-black text-white">
              Technical Testing Only
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Speed test values are used to show download, upload, ping, and
              jitter results.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <BarChart3 size={25} className="text-orange-400" />
            <h2 className="mt-4 text-lg font-black text-white">
              Google Analytics
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              AXVOI may use analytics to understand website traffic and improve
              user experience.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 rounded-[2rem] border border-orange-400/20 bg-orange-400/10 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-400/10">
              <AlertTriangle size={22} className="text-orange-300" />
            </div>

            <div>
              <h2 className="text-lg font-black text-white">
                Important Analytics Notice
              </h2>
              <p className="mt-2 text-sm leading-7 text-white/55">
                The AXVOI SpeedTest tool itself does not collect personal user
                data by default. However, because Google Analytics may be used on
                the website, limited usage and device information may be processed
                by Google Analytics according to your browser settings, consent
                choices, and Google’s privacy practices.
              </p>
            </div>
          </div>
        </div>

        {/* Main Policy Content */}
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-white/10 bg-[#07101f]/70 p-5 transition hover:border-[#15E28B]/25 hover:bg-[#07101f]"
              >
                <h2 className="text-lg font-black text-white">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Extra Explanation */}
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10">
              <Cookie size={22} className="text-[#15E28B]" />
            </div>

            <h2 className="mt-5 text-xl font-black text-white">
              About Cookies
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/50">
              AXVOI SpeedTest does not need cookies to perform the speed test.
              Google Analytics may use cookies or similar technologies for
              website analytics. Users can manage cookies through their browser
              privacy settings.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10">
              <Globe size={22} className="text-sky-400" />
            </div>

            <h2 className="mt-5 text-xl font-black text-white">
              LibreSpeed Usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/50">
              LibreSpeed technology may process technical connection information
              during a test, such as speed, latency, and IP-related details
              required for diagnostics. AXVOI SpeedTest uses this information to display
              speed test results to the user.
            </p>
          </div>
        </div>

        {/* Contact Box */}
        <div className="mt-10 rounded-[2rem] border border-[#15E28B]/20 bg-[#15E28B]/8 p-6 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#15E28B]/25 bg-[#15E28B]/10">
            <Mail size={22} className="text-[#15E28B]" />
          </div>

          <h2 className="mt-4 text-xl font-black text-white">
            Privacy Questions?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">
            For questions about this Privacy Policy, AXVOI SpeedTest, or AXVOI
            services, please contact AXVOI through the official website.
          </p>

          <a
            href="https://axvoi.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/30 bg-[#15E28B]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#15E28B] transition hover:bg-[#15E28B]/20"
          >
            <Globe size={15} />
            Contact AXVOI
          </a>
        </div>
      </section>
    </main>
  );
}
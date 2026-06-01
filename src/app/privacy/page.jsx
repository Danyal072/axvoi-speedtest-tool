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
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — AXVOI SpeedTest by AXVOI",
  description:
    "Privacy Policy for AXVOI SpeedTest by AXVOI. Learn how the tool works, what it does not collect, and how Google Analytics may be used.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — AXVOI SpeedTest",
    description: "Read the Privacy Policy for AXVOI SpeedTest.",
    url: "https://axvoi.com/privacy",
  },
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
    title: "5. Local Browser History & Storage Keys",
    content:
      "If the tool shows recent test history, that history is stored locally in your own browser using localStorage (specifically in the key 'axvoi_speedtest_v3'). This means the data remains entirely on your device/browser and is not submitted to AXVOI. Additionally, when you accept or dismiss the cookie consent banner, your preference is saved in local storage under 'axvoi_cookie_consent' to prevent the notice from appearing again.",
  },
  {
    title: "6. Google Analytics & Performance Cookies",
    content:
      "AXVOI may use Google Analytics to collect anonymous metrics about website usage, such as page views, device type, browser type, approximate geographic location, traffic source, and speed test interactions. These analytics cookies help us understand how AXVOI SpeedTest is used so we can improve network capacity, optimize routing, and enhance general performance. Analytics data is processed in accordance with Google's privacy practices.",
  },
  {
    title: "7. Detailed Cookie Statement",
    content:
      "Cookies are small text files that websites place on your device when you visit them to make them work, remember user choices, or analyze performance. AXVOI SpeedTest uses these technologies to improve your experience, remember your cookie consent preferences, support speed test features (like your local diagnostic history), and analyze traffic patterns. We use local storage for essential utility states and anonymized analytics cookies for traffic analysis. The core speed test diagnostic does not require cookies to measure your internet connection speed.",
  },
  {
    title: "8. How to Manage Cookies and Your Choices",
    content:
      "You have complete control over cookies and browser local storage. You can block or delete cookies through your web browser's privacy settings, use privacy-focused extensions, or clear your local browser site data. Please note that clearing local storage will erase your local speed test history. If you do not want Google Analytics to process usage information, you may use browser settings, privacy extensions, or Google’s available opt-out tools.",
  },
  {
    title: "9. Third-Party Services",
    content:
      "AXVOI SpeedTest may rely on third-party technologies, including LibreSpeed for speed testing functionality and Google Analytics for website analytics. These third-party services may process limited technical information according to their own policies and configurations.",
  },
  {
    title: "10. Data Sharing",
    content:
      "AXVOI does not sell personal data collected through AXVOI SpeedTest. Since the tool does not collect personal information by default, there is no user account data or registration data to sell. Analytics data may be processed by Google Analytics according to Google’s own service terms and privacy practices.",
  },
  {
    title: "11. Data Security",
    content:
      "We aim to keep the service secure and reliable. However, no website or online service can be guaranteed to be completely secure. Users should avoid entering personal or sensitive information into any tool or page unless it is specifically required and clearly explained.",
  },
  {
    title: "12. Children’s Privacy",
    content:
      "AXVOI SpeedTest is a general network diagnostic tool and is not intended to knowingly collect personal information from children. Since the tool does not require account creation or personal data submission, it is not designed to collect personal information from minors.",
  },
  {
    title: "13. Changes to This Policy",
    content:
      "AXVOI may update this Privacy Policy from time to time to reflect changes in the tool, analytics setup, legal requirements, or website operations. The updated version will be posted on this page with a revised update date.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-44 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-sky-400/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#15E28B]/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/85 to-white" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-primary/10 shadow-[0_0_30px_rgba(21,226,139,0.18)]">
            <ShieldCheck size={30} className="text-primary" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/20 bg-[#15E28B]/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            AXVOI Privacy Notice
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            AXVOI SpeedTest by AXVOI is designed to measure internet
            performance without asking users for personal information. This
            policy explains what the tool does not collect, how speed testing
            works, and how Google Analytics may be used.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Privacy Summary Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <EyeOff size={25} className="text-primary" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              No User Account Data
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The tool does not require sign-up, login, name, email, phone
              number, or payment details.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <Server size={25} className="text-sky-400" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              Technical Testing Only
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Speed test values are used to show download, upload, ping, and
              jitter results.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <BarChart3 size={25} className="text-orange-400" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              Google Analytics
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
              <h2 className="text-lg font-black text-foreground">
                Important Analytics Notice
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
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
        <div className="mt-10 rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const isCookieSection = section.title.toLowerCase().includes("cookie");
              return (
                <article
                  key={section.title}
                  id={isCookieSection ? "cookies" : undefined}
                  className={`rounded-3xl border border-border bg-[var(--card)]/70 p-5 transition hover:border-primary/25 hover:bg-[var(--card)] scroll-mt-24 ${
                    isCookieSection ? "border-emerald-400/25 bg-emerald-400/5 shadow-[0_0_20px_rgba(21,226,139,0.05)]" : ""
                  }`}
                >
                  <h2 className="text-lg font-black text-foreground">
                    {section.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {section.content}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Extra Explanation */}
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
              <Cookie size={22} className="text-primary" />
            </div>

            <h2 className="mt-5 text-xl font-black text-foreground">
              About Cookies
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              AXVOI SpeedTest does not need cookies to perform the speed test.
              Google Analytics may use cookies or similar technologies for
              website analytics. Users can manage cookies through their browser
              privacy settings.
            </p>

            <Link
              href="#cookies"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/30 bg-primary/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary transition hover:bg-[#15E28B]/20"
            >
              <Cookie size={15} />
              Jump to Cookie Statement
            </Link>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10">
              <Globe size={22} className="text-sky-400" />
            </div>

            <h2 className="mt-5 text-xl font-black text-foreground">
              LibreSpeed Usage
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              LibreSpeed technology may process technical connection information
              during a test, such as speed, latency, and IP-related details
              required for diagnostics. AXVOI SpeedTest uses this information to display
              speed test results to the user.
            </p>
          </div>
        </div>

        {/* Contact Box */}
        <div className="mt-10 rounded-[2rem] border border-[#15E28B]/20 bg-[#15E28B]/8 p-6 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
            <Mail size={22} className="text-primary" />
          </div>

          <h2 className="mt-4 text-xl font-black text-foreground">
            Privacy Questions?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            For questions about this Privacy Policy, AXVOI SpeedTest, or AXVOI
            services, please contact AXVOI through the official website.
          </p>

          <a
            href="https://axvoi.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/30 bg-primary/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary transition hover:bg-[#15E28B]/20"
          >
            <Globe size={15} />
            Contact AXVOI
          </a>
        </div>
      </section>
    </main>
  );
}
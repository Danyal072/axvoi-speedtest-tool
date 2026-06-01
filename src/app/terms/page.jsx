import {
  FileText,
  ShieldCheck,
  Gauge,
  AlertTriangle,
  Globe,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — AXVOI SpeedTest",
  description:
    "Read the terms and conditions for using AXVOI SpeedTest by AXVOI.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions — AXVOI SpeedTest",
    description: "Read the Terms & Conditions for AXVOI SpeedTest.",
    url: "https://axvoi.com/terms",
  },
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using AXVOI SpeedTest, you agree to follow these Terms & Conditions. If you do not agree with these terms, please do not use this service.",
  },
  {
    title: "2. Purpose of the Service",
    content:
      "AXVOI SpeedTest is provided to help users estimate their internet connection performance, including download speed, upload speed, ping, and jitter. Results may vary depending on network conditions, server location, browser performance, device hardware, and ISP routing.",
  },
  {
    title: "3. Accuracy of Results",
    content:
      "We aim to provide useful and reliable speed test results, but we do not guarantee that every reading will be fully accurate. Tests performed on localhost, local network, VPN, proxy, or shared hosting may not reflect your actual public internet speed.",
  },
  {
    title: "4. User Responsibility",
    content:
      "You are responsible for using this service lawfully and responsibly. You should not misuse the service, attempt to overload the server, interfere with its operation, or use automated systems to repeatedly run tests without permission.",
  },
  {
    title: "5. Third-Party Services",
    content:
      "AXVOI SpeedTest may use third-party services or APIs for IP, ISP, or location-related information. These services may have their own privacy policies, terms, and limitations.",
  },
  {
    title: "6. No Professional Guarantee",
    content:
      "The service is provided for general diagnostic and informational purposes only. It should not be considered a guaranteed professional network audit, legal statement, ISP certification, or service-level agreement measurement.",
  },
  {
    title: "7. Availability",
    content:
      "We may update, modify, suspend, or discontinue the service at any time without prior notice. We are not responsible for temporary downtime, technical errors, server issues, maintenance, or third-party service interruptions.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "AXVOI and AXVOI SpeedTest are not liable for any direct, indirect, incidental, or consequential damages resulting from the use of this service, including incorrect test results, network issues, business losses, or reliance on the displayed data.",
  },
  {
    title: "9. Intellectual Property",
    content:
      "The AXVOI SpeedTest name, design, branding, user interface, written content, and related materials belong to AXVOI unless otherwise stated. You may not copy, reproduce, or redistribute the service branding without permission.",
  },
  {
    title: "10. Changes to These Terms",
    content:
      "We may update these Terms & Conditions from time to time. Continued use of the service after updates means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(21,226,139,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#15E28B]/30 bg-primary/10 shadow-[0_0_30px_rgba(21,226,139,0.18)]">
            <FileText size={28} className="text-primary" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#15E28B]/20 bg-[#15E28B]/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            AXVOI SpeedTest Legal
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Please read these terms carefully before using AXVOI SpeedTest.
            By using this service, you agree to the conditions described below.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <ShieldCheck size={24} className="text-primary" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              Safe Usage
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the service responsibly and avoid abusive or automated testing.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <Gauge size={24} className="text-sky-400" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              Estimated Results
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Speed readings are estimates and may vary by server, device, and network.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
            <AlertTriangle size={24} className="text-orange-400" />
            <h2 className="mt-4 text-lg font-black text-foreground">
              No Guarantee
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This tool is provided for general diagnostics, not certified ISP reporting.
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="mt-10 rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-border bg-[var(--card)]/70 p-5 transition hover:border-primary/25 hover:bg-[var(--card)]"
              >
                <h2 className="text-lg font-black text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Contact Box */}
        <div className="mt-10 rounded-[2rem] border border-[#15E28B]/20 bg-[#15E28B]/8 p-6 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
            <Mail size={22} className="text-primary" />
          </div>

          <h2 className="mt-4 text-xl font-black text-foreground">
            Questions about these terms?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            For questions related to AXVOI SpeedTest or AXVOI services, please contact us through the official AXVOI website.
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
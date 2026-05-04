import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "AXVOI SpeedTest — Test Your Internet Speed",
  description:
    "Fast, accurate internet speed test powered by LibreSpeed. Measure your download speed, upload speed, ping, and jitter in seconds.",
  keywords: [
    "speed test",
    "internet speed",
    "bandwidth test",
    "ping test",
    "LibreSpeed",
    "AXVOI",
  ],
  openGraph: {
    title: "AXVOI SpeedTest",
    description:
      "Test your internet speed instantly — download, upload, ping and jitter.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030813",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-[#030813] text-white antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
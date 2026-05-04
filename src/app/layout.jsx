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
  metadataBase: new URL("https://axvoi.com"),
  title: "AXVOI SpeedTest — Test Your Internet Speed",
  description:
    "Fast, accurate internet speed test powered by AXVOI. Measure your download speed, upload speed, ping, and jitter in seconds.",
  keywords: [
    "speed test",
    "internet speed",
    "bandwidth test",
    "ping test",
    "network diagnostic",
    "AXVOI",
  ],
  authors: [{ name: "AXVOI" }],
  openGraph: {
    title: "AXVOI SpeedTest — Test Your Internet Speed",
    description:
      "Test your internet speed instantly — download, upload, ping and jitter.",
    url: "https://axvoi.com",
    siteName: "AXVOI SpeedTest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXVOI SpeedTest",
    description:
      "Test your internet speed instantly — download, upload, ping and jitter.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030813",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AXVOI SpeedTest",
    "description": "Professional, highly accurate internet speed test tool. Measure your download speed, upload speed, ping, and jitter instantly with zero ads.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "url": "https://axvoi.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time download speed testing",
      "Real-time upload speed testing",
      "Ping and Jitter measurements",
      "Secure and private"
    ],
    "author": {
      "@type": "Organization",
      "name": "AXVOI",
      "url": "https://axvoi.com"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-[#030813] text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
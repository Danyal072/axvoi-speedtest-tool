import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalyticsWrapper from "@/components/GoogleAnalyticsWrapper";
import CookieConsent from "@/components/CookieConsent";

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
  metadataBase: new URL("https://speed.axvoi.com"),
  title: "Internet Speed Test Online – Check WiFi, Ping & Download Speed",
  description:
    "Test your internet speed online with AXVOI SpeedTest. Check download speed, upload speed, ping, jitter, WiFi performance, and network stability instantly.",
  keywords: [
    "internet speed test",
    "speed test",
    "wifi speed test",
    "broadband speed test",
    "download speed test",
    "upload speed test",
    "ping test",
    "latency test",
    "jitter test",
    "network stability test",
    "bandwidth test",
    "connection speed test",
    "online speed test",
    "test internet speed",
    "check internet speed",
    "my internet speed",
    "AXVOI SpeedTest",
    "AXVOI",

    "test internet",
    "internet connection speed test",
    "my internet speed test",
    "how to test internet speed",
    "internet connection test",
    "my wifi speed",
    "test internet speed connection",
    "test of speed internet",
    "my speed test",
    "speed test online",
    "test network speed",
    "wifi connectivity test",
    "test speed wifi",
    "what's my internet speed",
    "how check internet speed",
    "speed test on internet",
    "speed test internet",
    "wireless speed test",
    "speed check",
    "test internet speed online",
    "speed test internet connection",
    "my internet speed",
    "how to check wifi speed",
    "test speed internet",
    "wifi test",
    "modem test speed",
    "check my internet speed",
    "bandwidth speed test",
    "test internet speed",
    "measure internet speed",
    "broadband test",
    "how to check internet speed",
    "check internet speed",
    "test internet connection",
    "internet test",
    "test wifi",
    "whats my internet speed",
    "internet test speed",
    "test my internet speed",
    "internet speed",
  ],
  authors: [{ name: "AXVOI" }],
  openGraph: {
    title: "Internet Speed Test Online – Check WiFi, Ping & Download Speed",
    description:
      "Test your internet speed online with AXVOI SpeedTest. Check download speed, upload speed, ping, jitter, WiFi performance, and network stability instantly.",
    url: "https://speed.axvoi.com/",
    siteName: "AXVOI SpeedTest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet Speed Test Online – Check WiFi, Ping & Download Speed",
    description:
      "Test your internet speed online with AXVOI SpeedTest. Check download speed, upload speed, ping, jitter, WiFi performance, and network stability instantly.",
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
  alternates: {
    canonical: "https://speed.axvoi.com/",
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
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://axvoi.com/#organization",
        "name": "AXVOI",
        "url": "https://axvoi.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://axvoi.com/logo.png"
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://speed.axvoi.com/#website",
        "url": "https://speed.axvoi.com/",
        "name": "AXVOI SpeedTest",
        "alternateName": "AXVOI Internet Speed Test",
        "description": "AXVOI SpeedTest is an online internet speed test tool for checking download speed, upload speed, ping, jitter, WiFi performance, broadband speed, latency, bandwidth, and network stability.",
        "publisher": {
          "@id": "https://axvoi.com/#organization"
        },
        "inLanguage": "en-US",
        "keywords": metadata.keywords.join(", ")
      },
      {
        "@type": "WebApplication",
        "@id": "https://speed.axvoi.com/#webapplication",
        "name": "AXVOI SpeedTest",
        "url": "https://speed.axvoi.com/",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript and a modern web browser.",
        "description": "Test your internet speed instantly with AXVOI SpeedTest. Check download speed, upload speed, ping, jitter, WiFi performance, broadband speed, latency, bandwidth, and network stability in seconds.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Internet speed test online",
          "Internet speed test",
          "Download speed test",
          "Upload speed test",
          "Ping test",
          "Jitter test",
          "Latency test",
          "WiFi speed test",
          "Broadband speed test",
          "Bandwidth test",
          "Network stability test",
          "Real-time speed measurement"
        ],
        "publisher": {
          "@id": "https://axvoi.com/#organization"
        },
        "isAccessibleForFree": true,
        "inLanguage": "en-US",
        "keywords": metadata.keywords.join(", ")
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://speed.axvoi.com/#softwareapplication",
        "name": "AXVOI SpeedTest",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web Browser",
        "url": "https://speed.axvoi.com/",
        "description": "AXVOI SpeedTest is a free browser-based speed test tool that measures internet download speed, upload speed, ping, jitter, latency, and network stability.",
        "softwareVersion": "1.0.0",
        "author": {
          "@id": "https://axvoi.com/#organization"
        },
        "publisher": {
          "@id": "https://axvoi.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "isAccessibleForFree": true,
        "keywords": metadata.keywords.join(", ")
      },
      {
        "@type": "FAQPage",
        "@id": "https://speed.axvoi.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is AXVOI SpeedTest?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AXVOI SpeedTest is a free online internet speed test tool that measures download speed, upload speed, ping, jitter, latency, and network stability."
            }
          },
          {
            "@type": "Question",
            "name": "What does download speed mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Download speed shows how quickly your internet connection receives data from the internet. It affects streaming, browsing, downloads, and website loading."
            }
          },
          {
            "@type": "Question",
            "name": "What does upload speed mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Upload speed shows how quickly your internet connection sends data. It is important for video calls, cloud backups, sending files, and live streaming."
            }
          },
          {
            "@type": "Question",
            "name": "What is ping in a speed test?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ping measures the response time between your device and the test server. Lower ping usually means a faster and more responsive connection."
            }
          },
          {
            "@type": "Question",
            "name": "What is jitter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Jitter measures how much your ping changes during the test. Lower jitter means a more stable connection for gaming, video calls, and live communication."
            }
          },
          {
            "@type": "Question",
            "name": "Is AXVOI SpeedTest free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AXVOI SpeedTest is free to use and works directly in a modern web browser."
            }
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <GoogleAnalyticsWrapper />

        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <CookieConsent />
      </body>
    </html>
  );
}
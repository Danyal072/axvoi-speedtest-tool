# AXVOI SpeedTest

AXVOI SpeedTest is a professional, high-performance internet speed testing application built with the **Next.js App Router**. It provides a premium, real-time dashboard for measuring download speed, upload speed, ping, and jitter, while also exposing a robust API for external integration.

![AXVOI SpeedTest Preview](./public/opengraph-image.webp)

## 🌟 Features

- **🚀 Real-time Performance Metrics**: High-accuracy measurement of Download, Upload, Ping, and Jitter.
- **🎨 Premium Nebula Glass UI**: A modern, animated dashboard using Framer Motion and Lucide icons.
- **📈 Dynamic Speedometer**: An adaptive analog-style gauge that scales based on your connection speed.
- **🔗 Production-Ready API**: Clean, CORS-enabled endpoints for internal and external speed test clients.
- **📜 Local Test History**: Keeps track of your last 10 test results locally in the browser.
- **🌍 IP & ISP Detection**: Automatically identifies your client IP, ISP, and location metadata.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- **📊 Google Analytics 4**: Integrated GA4 tracking for usage analytics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Engine**: [LibreSpeed](https://github.com/librespeed/speedtest) (Customized integration)
- **Deployment**: Optimized for Vercel and Node.js environments.

## 📂 Project Structure

```text
├── public/
│   ├── speedtest.js          # Main speed test engine (LibreSpeed)
│   ├── speedtest_worker.js   # Background worker for measurements
│   └── garbage.dat           # Static fallback for download tests
├── src/
│   ├── app/
│   │   ├── api/speedtest/    # Backend API logic & CORS helper
│   │   ├── privacy/          # Privacy policy page
│   │   ├── terms/            # Terms of service page
│   │   ├── globals.css       # Global styles & Tailwind config
│   │   ├── layout.jsx        # Root layout with SEO metadata
│   │   └── page.jsx          # Main SpeedTest dashboard
│   └── components/           # Reusable UI components
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── HeaderActions.jsx # IP detection UI
│       └── GoogleAnalytics.jsx
└── .env.local                # Environment configuration
```

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher recommended.
- **Package Manager**: `pnpm` is used in this project (npm or yarn also work).

### 2. Installation
```bash
git clone <repository-url>
cd speedtest
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Google Analytics 4 (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# CORS Settings (Optional)
# Use '*' to allow all origins or a comma-separated list of URLs
SPEEDTEST_ALLOWED_ORIGINS=*
```

### 4. Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔌 API Documentation

AXVOI SpeedTest provides a dedicated API namespace at `/api/speedtest/`. All routes support **CORS preflight (OPTIONS)** for cross-origin requests.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/speedtest/health` | `GET` | API status and version check. |
| `/api/speedtest/config` | `GET` | Returns engine configuration and route mapping. |
| `/api/speedtest/ip` | `GET` | Returns client IP. Supports `?json=true` for metadata. |
| `/api/speedtest/garbage`| `GET` | Generates random data for download testing. |
| `/api/speedtest/empty`  | `GET/POST`| Used for Ping (GET) and Upload (POST) testing. |

### CORS Support
If you are testing from a separate client (e.g., a standalone HTML file on `localhost:5500`), ensure `SPEEDTEST_ALLOWED_ORIGINS` is set correctly in your `.env.local` to avoid preflight errors.

## 🧪 Testing with External Client
To test the API from an external local client:
1. Start the Next.js app on `localhost:3000`.
2. Ensure your client (e.g., `127.0.0.1:5500`) is allowed in `SPEEDTEST_ALLOWED_ORIGINS`.
3. The client should call `http://localhost:3000/api/speedtest/config` to get the necessary test paths.

## 📝 License
This project is proprietary and built for AXVOI. Please refer to the [Terms of Service](./src/app/terms/page.jsx) for usage guidelines.

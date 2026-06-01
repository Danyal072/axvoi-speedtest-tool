import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AXVOI SpeedTest internet speed test dashboard preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 90, fontWeight: 900, color: "#111827", marginBottom: 20 }}>
            AXVOI SpeedTest
          </div>
          <div style={{ fontSize: 40, color: "#4b5563", textAlign: "center", maxWidth: 800 }}>
            Test your internet connection speed instantly. Download, Upload, and Ping.
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 60 }}>
          <div
            style={{
              background: "#15E28B",
              color: "#ffffff",
              padding: "16px 48px",
              borderRadius: 60,
              fontSize: 32,
              fontWeight: 800,
              boxShadow: "0 8px 30px rgba(21, 226, 139, 0.3)",
            }}
          >
            Start Test
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

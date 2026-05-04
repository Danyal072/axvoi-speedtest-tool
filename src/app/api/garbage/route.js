import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ONE_MB = 1024 * 1024;
const MAX_SIZE_MB = 100;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  let ckSize = Number.parseInt(searchParams.get("ckSize") || "10", 10);

  if (!Number.isFinite(ckSize) || ckSize <= 0) {
    ckSize = 10;
  }

  ckSize = Math.min(ckSize, MAX_SIZE_MB);

  const totalBytes = ckSize * ONE_MB;
  let sentBytes = 0;

  const stream = new ReadableStream({
    async pull(controller) {
      if (sentBytes >= totalBytes) {
        controller.close();
        return;
      }

      const remainingBytes = totalBytes - sentBytes;
      const chunkSize = Math.min(ONE_MB, remainingBytes);

      // Generate fresh random data per chunk to avoid compression/caching effects
      const chunk = crypto.randomBytes(chunkSize);

      sentBytes += chunkSize;
      controller.enqueue(chunk);

      // Small yield to avoid locking Node event loop
      await new Promise((resolve) => setImmediate(resolve));
    },

    cancel() {
      sentBytes = totalBytes;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalBytes),

      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      Pragma: "no-cache",
      Expires: "0",

      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cache-Control",

      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cache-Control",
    },
  });
}
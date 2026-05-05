import { getCorsHeaders } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
};

function getHeaders(request) {
  return {
    ...NO_CACHE_HEADERS,
    ...getCorsHeaders(request),
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

export async function GET(request) {
  return Response.json(
    {
      service: "AXVOI SpeedTest",
      version: "1.0.0",
      routes: {
        download: "/api/speedtest/garbage",
        upload: "/api/speedtest/empty",
        ping: "/api/speedtest/ping",
        ip: "/api/speedtest/ip",
        health: "/api/speedtest/health",
      },
      settings: {
        time_dl_max: 10,
        time_ul_max: 10,
        time_auto: true,
        xhr_dlMultistream: 3,
        xhr_ulMultistream: 2,
        ping_count: 10,
        garbagePhp_chunkSize: 20,
      },
    },
    {
      status: 200,
      headers: getHeaders(request),
    }
  );
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getHeaders(request),
  });
}
import { getCorsHeaders } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return Response.json(
    {
      routes: {
        download: "/api/speedtest/garbage",
        upload: "/api/speedtest/empty",
        ping: "/api/speedtest/empty",
        ip: "/api/speedtest/ip",
        health: "/api/speedtest/health"
      },
      settings: {
        time_dl_max: 10,
        time_ul_max: 10,
        time_auto: true,
        xhr_dlMultistream: 3,
        xhr_ulMultistream: 2,
        ping_count: 10,
        garbagePhp_chunkSize: 20
      }
    },
    {
      status: 200,
      headers: {
        ...getCorsHeaders(request),
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

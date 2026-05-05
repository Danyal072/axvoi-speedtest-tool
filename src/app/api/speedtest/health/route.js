import { getCorsHeaders } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return Response.json(
    {
      status: "ok",
      service: "AXVOI SpeedTest API",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
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

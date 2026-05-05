import { getCorsHeaders } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return new Response("", {
    status: 200,
    headers: {
      ...getCorsHeaders(request),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
      "Pragma": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

export async function POST(request) {
  return new Response("", {
    status: 200,
    headers: {
      ...getCorsHeaders(request),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
      "Pragma": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
}

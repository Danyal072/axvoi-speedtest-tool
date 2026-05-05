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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getHeaders(request),
  });
}

export async function GET(request) {
  return new Response("", {
    status: 200,
    headers: getHeaders(request),
  });
}

export async function POST(request) {
  return new Response("", {
    status: 200,
    headers: getHeaders(request),
  });
}
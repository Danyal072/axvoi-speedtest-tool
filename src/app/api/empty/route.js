export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
      "Pragma": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

export async function POST() {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
      "Pragma": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

export async function OPTIONS() {
  return new Response("", {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    }
  });
}

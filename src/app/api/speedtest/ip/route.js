/**
 * /api/speedtest/ip — LibreSpeed-compatible IP + ISP detection route.
 *
 * Supports:
 * - /api/speedtest/ip              -> plain text IP for LibreSpeed basic mode
 * - /api/speedtest/ip?isp=true     -> JSON with processedString + rawIspInfo
 * - /api/speedtest/ip?json=true    -> JSON for frontend/HeaderActions
 */

import { getCorsHeaders } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function corsHeaders(request, contentType = "text/plain") {
  return {
    ...getCorsHeaders(request),
    "Cache-Control":
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
    Pragma: "no-cache",
    Expires: "0",
    "Content-Type": contentType,
  };
}

function getClientIp(request) {
  const cfIp = request.headers.get("cf-connecting-ip");
  const realIp = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");

  const ip =
    cfIp ||
    realIp ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown";

  return ip;
}

async function getIspInfo(ip) {
  const fallback = {
    ip,
    org: "Unknown ISP",
    asn: "",
    country: "",
    city: "",
  };

  try {
    const url =
      ip && ip !== "unknown"
        ? `https://ipapi.co/${encodeURIComponent(ip)}/json/`
        : "https://ipapi.co/json/";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "axvoi-speedtest/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return fallback;

    const data = await res.json();

    return {
      ip: data.ip || ip,
      org: data.org || data.asn || "Unknown ISP",
      asn: data.asn || "",
      country: data.country_code || "",
      city: data.city || "",
    };
  } catch {
    return fallback;
  }
}

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;

  const wantsIsp = searchParams.has("isp");
  const wantsJson = searchParams.has("json");

  try {
    const clientIp = getClientIp(request);
    const ispInfo = await getIspInfo(clientIp);

    const ip = ispInfo.ip || clientIp || "unknown";

    const location =
      ispInfo.city || ispInfo.country
        ? ` (${[ispInfo.city, ispInfo.country].filter(Boolean).join(", ")})`
        : "";

    const processedString =
      ispInfo.org && ispInfo.org !== "Unknown ISP"
        ? `${ip} - ${ispInfo.org}${location}`
        : ip;

    /**
     * LibreSpeed ISP mode expects JSON:
     * {
     *   processedString: "...",
     *   rawIspInfo: "..."
     * }
     */
    if (wantsIsp) {
      return Response.json(
        {
          processedString,
          rawIspInfo: JSON.stringify(ispInfo),
        },
        {
          headers: corsHeaders(request, "application/json"),
        }
      );
    }

    /**
     * Frontend/HeaderActions mode.
     * Use /api/speedtest/ip?json=true for React components.
     */
    if (wantsJson) {
      return Response.json(
        {
          ip,
          clientIp: ip,
          processedString,
          isp: ispInfo.org,
          country: ispInfo.country,
          city: ispInfo.city,
          rawIspInfo: ispInfo,
        },
        {
          headers: corsHeaders(request, "application/json"),
        }
      );
    }

    /**
     * LibreSpeed default mode expected plain text IP originally, 
     * but we now return valid JSON to avoid parsing errors in clients.
     */
    return Response.json(
      { processedString: processedString || ip },
      { headers: corsHeaders(request, "application/json") }
    );
  } catch {
    return Response.json(
      { processedString: "unknown" },
      { headers: corsHeaders(request, "application/json") }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, "text/plain"),
  });
}

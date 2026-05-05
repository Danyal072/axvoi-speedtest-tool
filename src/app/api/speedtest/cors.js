export function getCorsHeaders(request) {
  const origin = request?.headers?.get("origin");
  const allowedOrigins = process.env.SPEEDTEST_ALLOWED_ORIGINS || "*";

  const baseHeaders = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Cache-Control, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (allowedOrigins === "*") {
    return {
      ...baseHeaders,
      "Access-Control-Allow-Origin": origin || "*",
    };
  }

  const allowedList = allowedOrigins
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (origin && allowedList.includes(origin)) {
    return {
      ...baseHeaders,
      "Access-Control-Allow-Origin": origin,
    };
  }

  return baseHeaders;
}
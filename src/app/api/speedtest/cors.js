export function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = process.env.SPEEDTEST_ALLOWED_ORIGINS || "*";
  
  let allowOrigin = "*";
  
  if (allowedOrigins !== "*") {
    const allowedList = allowedOrigins.split(",").map((s) => s.trim());
    if (origin && allowedList.includes(origin)) {
      allowOrigin = origin;
    } else {
      // If the origin is not in the list, we can fallback to the first allowed origin,
      // but usually we just don't set it or set it to 'null'.
      // To prevent errors, we'll just echo back the origin if it matches,
      // otherwise we don't allow it. But if no origin header, fallback to *.
      allowOrigin = origin || allowedList[0];
    }
  } else {
    // If '*' is used, we can just echo the origin if credentials are used,
    // but for our speedtest we don't use credentials, so '*' is fine.
    // However, some browsers prefer the exact origin. Let's echo it if present, otherwise '*'
    allowOrigin = origin || "*";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Cache-Control, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

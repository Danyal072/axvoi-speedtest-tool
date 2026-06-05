export default function robots() {
  const baseUrl = "https://speed.axvoi.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/public/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

"use client";

import dynamic from "next/dynamic";

const GoogleAnalyticsComponent = dynamic(
  () => import("./GoogleAnalytics"),
  { ssr: false }
);

export default GoogleAnalyticsComponent;

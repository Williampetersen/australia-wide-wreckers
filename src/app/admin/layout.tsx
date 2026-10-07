import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { default: "AWW Inbox", template: "%s | AWW Inbox" },
  robots: { index: false, follow: false, nocache: true },
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "AWW Inbox", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3f",
  viewportFit: "cover",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-zinc-100 text-ink">{children}</div>;
}

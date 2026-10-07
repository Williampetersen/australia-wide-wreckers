import type { ReactNode } from "react";
import { InboxApp } from "@/components/admin/inbox/InboxApp";

// The inbox lives in a layout so switching conversations does not remount the list.
export default function InboxLayout({ children }: { children: ReactNode }) {
  void children;
  return <InboxApp />;
}

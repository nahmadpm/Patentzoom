"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminRoute ? <SiteHeader /> : null}
      <div className="flex-1">{children}</div>
      {!isAdminRoute ? <SiteFooter /> : null}
    </div>
  );
}

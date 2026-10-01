"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/client";

/** Fires one `portfolio_opened` event per session, plus a resume/interview view. */
export function PageOpenTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("zgpt.opened")) {
        sessionStorage.setItem("zgpt.opened", "1");
        track("portfolio_opened");
      }
    } catch {
      track("portfolio_opened");
    }
  }, []);

  useEffect(() => {
    if (pathname === "/resume") track("resume_viewed");
    else if (pathname?.startsWith("/interview/")) {
      track("interview_page_viewed", pathname.replace("/interview/", ""));
    }
  }, [pathname]);

  return null;
}

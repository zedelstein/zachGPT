"use server";

import { cookies } from "next/headers";
import { checkPassword, dashboardPassword, OWNER_COOKIE, tokenFor } from "@/lib/analytics/auth";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const candidate = String(formData.get("password") ?? "");
  if (!checkPassword(candidate)) return "Incorrect password.";

  const password = dashboardPassword();
  if (password) {
    (await cookies()).set(OWNER_COOKIE, tokenFor(password), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/dashboard",
      maxAge: 60 * 60 * 12,
    });
  }
  return null;
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: OWNER_COOKIE, path: "/dashboard" });
}

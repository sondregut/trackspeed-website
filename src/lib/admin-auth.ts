import { cookies } from "next/headers";
import { requireServerEnv, timingSafeEqualString } from "@/lib/server-secrets";

export async function verifyAdminSession(): Promise<boolean> {
  let expectedToken: string;

  try {
    expectedToken = requireServerEnv("ADMIN_SESSION_TOKEN");
  } catch (error) {
    console.error("Admin auth is not configured:", error);
    return false;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return false;
  }

  return timingSafeEqualString(sessionToken, expectedToken);
}

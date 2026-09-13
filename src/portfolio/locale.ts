import { cookies } from "next/headers";
export async function getLocale() {
  return (await cookies()).get("locale")?.value === "ro" ? "ro" : "en";
}

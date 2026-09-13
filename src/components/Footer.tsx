"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
export default function Footer() {
  const path = usePathname();
  const { locale } = useLocale();
  if (path.startsWith("/studio")) return null;
  return (
    <footer className="footer wrap">
      <span>
        © Dumitru Corduneanu · {locale === "ro" ? "Fotografii" : "Photographs"}
      </span>
      <div>
        <Link href="/work">
          {locale === "ro" ? "Lucrări selectate" : "Selected work"}
        </Link>
        <a
          href="https://www.instagram.com/sar_da_na_pal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram ↗
        </a>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}

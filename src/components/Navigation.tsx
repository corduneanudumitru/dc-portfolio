"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
export default function Navigation() {
  const pathname = usePathname();
  const { locale } = useLocale();
  if (pathname.startsWith("/studio")) return null;
  const ro = locale === "ro";
  return (
    <>
      <a className="skip" href="#main">
        {ro ? "Sari la fotografii" : "Skip to photographs"}
      </a>
      <header className="masthead wrap">
        <Link href="/" className="brand">
          Dumitru Corduneanu
        </Link>
        <nav
          className="nav"
          aria-label={ro ? "Navigare principală" : "Main navigation"}
        >
          {[
            ["/work", ro ? "Lucrări" : "Work"],
            ["/collections/moldova", "Moldova"],
            ["/books", ro ? "Cărți" : "Books"],
            ["/about", ro ? "Despre" : "About"],
            ["/contact", "Contact"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <button
            className="locale-switch"
            aria-label={ro ? "Switch to English" : "Schimbă în română"}
            onClick={() => {
              document.cookie = `locale=${ro ? "en" : "ro"};path=/;max-age=31536000;samesite=lax`;
              window.location.reload();
            }}
          >
            {ro ? "EN" : "RO"}
          </button>
        </nav>
      </header>
    </>
  );
}

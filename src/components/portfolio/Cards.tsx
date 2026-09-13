import Link from "next/link";
import type { CSSProperties } from "react";
import type { Collection } from "@/portfolio/data";
import Photo from "./Photo";
export const kinds = ["Themes", "Projects", "Portraits", "Studies"];
export const kindRo: Record<string, string> = {
  Themes: "Teme",
  Projects: "Proiecte",
  Portraits: "Portrete",
  Studies: "Studii",
};
export function Tabs({
  active = "",
  locale = "en",
}: {
  active?: string;
  locale?: string;
}) {
  return (
    <nav
      className="category-nav"
      aria-label={locale === "ro" ? "Categorii" : "Types of work"}
    >
      {kinds.map((k) => (
        <Link
          key={k}
          className={active === k ? "active" : ""}
          href={"/work?kind=" + k.toLowerCase()}
        >
          {locale === "ro" ? kindRo[k] : k}
        </Link>
      ))}
    </nav>
  );
}
export function Card({
  collection: c,
  home = false,
  priority = false,
  locale = "en",
}: {
  collection: Collection;
  home?: boolean;
  priority?: boolean;
  locale?: string;
}) {
  const p = home && c.homeCover ? c.homeCover : c.cover;
  return (
    <Link
      className={`card ${p.width < p.height ? "portrait" : "landscape"}`}
      style={{ "--photo-ratio": p.width / p.height } as CSSProperties}
      href={"/collections/" + c.slug}
    >
      <div className="imagebox">
        <Photo photo={p} priority={priority} locale={locale} />
      </div>
      <div className="card-copy">
        <div className="card-top">
          <h3>{locale === "ro" && c.titleRo ? c.titleRo : c.title}</h3>
          <span className="count">
            {c.groups.reduce((n, g) => n + g.photos.length, 0)}{" "}
            {locale === "ro" ? "fotografii" : "photographs"} ↗
          </span>
        </div>
        <p>
          {locale === "ro" && c.descriptionRo ? c.descriptionRo : c.description}
        </p>
      </div>
    </Link>
  );
}

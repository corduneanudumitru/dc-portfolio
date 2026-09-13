import Link from "next/link";
import { getPortfolio } from "@/portfolio/data";
import { getLocale } from "@/portfolio/locale";
import { Card, Tabs, kinds, kindRo } from "@/components/portfolio/Cards";
export const dynamic = "force-dynamic";
export const metadata = { title: "Selected work" };
export default async function Work({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const [{ collections }, locale, params] = await Promise.all([
    getPortfolio(),
    getLocale(),
    searchParams,
  ]);
  const kind = kinds.find((k) => k.toLowerCase() === params.kind) || "";
  const ro = locale === "ro";
  return (
    <>
      <header className="page-intro">
        <div className="eyebrow">
          {ro ? "Fotografii selectate" : "Selected photographs"}
        </div>
        <h1>
          {kind
            ? ro
              ? kindRo[kind]
              : kind
            : ro
              ? "Lucrări selectate"
              : "Selected work"}
        </h1>
        <p>
          {ro
            ? "Teme, proiecte, portrete și studii scurte."
            : "Themes, sustained projects, portraits and smaller studies."}
        </p>
      </header>
      <div className="work-tabs">
        <Link href="/work">{ro ? "Toate lucrările" : "All work"}</Link>
        <Tabs active={kind} locale={locale} />
      </div>
      <div className="work-grid">
        {collections
          .filter((c) => !kind || c.kind === kind)
          .map((c) => (
            <Card key={c.id} collection={c} locale={locale} />
          ))}
      </div>
    </>
  );
}

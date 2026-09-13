import Link from "next/link";
import { getPortfolio } from "@/portfolio/data";
import { getLocale } from "@/portfolio/locale";
import { Card, Tabs } from "@/components/portfolio/Cards";
import Photo from "@/components/portfolio/Photo";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [{ collections: C, home }, locale] = await Promise.all([
    getPortfolio(),
    getLocale(),
  ]);
  const ro = locale === "ro";
  const get = (slug: string) => C.find((c) => c.slug === slug);
  const cards = (slugs: string[], priority = false) =>
    slugs.map((slug) => {
      const c = get(slug);
      return c ? (
        <Card
          key={slug}
          collection={c}
          home
          priority={priority}
          locale={locale}
        />
      ) : null;
    });
  return (
    <>
      <section className="home-intro">
        <div>
          <div className="eyebrow">
            Dumitru Corduneanu · {ro ? "Fotografie" : "Photography"}
          </div>
          <h1>
            {ro
              ? home.titleRo || "Oameni, locuri, clipe trecătoare."
              : home.title}
          </h1>
        </div>
        <Tabs locale={locale} />
      </section>
      <section
        aria-label={
          ro ? "Teme de fotografie stradală" : "Street photography themes"
        }
      >
        <div className="lead-grid">{cards(home.opening, true)}</div>
        <div className="more-themes">
          {home.secondary.map((slug) => {
            const c = get(slug);
            return c ? (
              <Link
                key={slug}
                className="mini-card"
                href={"/collections/" + slug}
              >
                <Photo photo={c.homeCover || c.cover} locale={locale} />
                <div>
                  <h3>{ro && c.titleRo ? c.titleRo : c.title}</h3>
                  <p>
                    {c.groups.flatMap((g) => g.photos).length}{" "}
                    {ro ? "fotografii" : "photographs"} ↗
                  </p>
                </div>
              </Link>
            ) : null;
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">
            {ro ? "Un proiect în desfășurare" : "An ongoing project"}
          </span>
          <Link className="textlink" href="/collections/moldova">
            {ro ? "Descoperă Moldova" : "View Moldova"} ↗
          </Link>
        </div>
        <div className="moldova">
          <Link
            className="moldova-pictures"
            href="/collections/moldova"
            aria-label={
              ro
                ? "Explorează proiectul Moldova"
                : "Explore the Moldova project"
            }
          >
            {home.moldovaPhotos.map((p) => (
              <Photo key={p.id} photo={p} locale={locale} />
            ))}
          </Link>
          <div className="moldova-copy">
            <div className="eyebrow">
              {ro ? "Oamenii Moldovei" : "People of Moldova"}
            </div>
            <h2>Moldova</h2>
            <p>
              {ro
                ? "Un corp de lucrări personal, care crește prin oamenii și locurile pe care le întâlnesc. Ceva familiar celor de aici; o privire pentru cei din alte părți."
                : "A personal body of work, growing through the people and places I encounter. Something familiar to those who live here; a glimpse for those who don’t."}
            </p>
            <Link className="textlink" href="/collections/moldova">
              {get("moldova")?.groups.flatMap((g) => g.photos).length}{" "}
              {ro
                ? "fotografii · Explorează proiectul"
                : "photographs · Explore the project"}{" "}
              ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>{ro ? "Proiecte" : "Projects"}</h2>
          <Link className="textlink" href="/work?kind=projects">
            {ro ? "Toate proiectele" : "All projects"} ↗
          </Link>
        </div>
        <div className="three-grid">
          {cards(["jerusalem", "lalibela", "bhutan"])}
        </div>
        <div className="section-links">
          {["ethiopia", "summer-gatherings"].map((slug) => {
            const c = get(slug);
            return c ? (
              <Link key={slug} href={"/collections/" + slug}>
                {ro && c.titleRo ? c.titleRo : c.title} ↗
              </Link>
            ) : null;
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>{ro ? "Portrete" : "Portraits"}</h2>
          <Link className="textlink" href="/work?kind=portraits">
            {ro ? "Toate portretele" : "All portraits"} ↗
          </Link>
        </div>
        <div className="portrait-row">{cards(["artists", "encounters"])}</div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>{ro ? "Studii" : "Studies"}</h2>
          <Link className="textlink" href="/work?kind=studies">
            {ro ? "Toate studiile" : "All studies"} ↗
          </Link>
        </div>
        <div className="three-grid">
          {cards(["tango", "high-ground", "close-to-home"])}
        </div>
      </section>
      <section className="section books-strip">
        <div>
          <div className="eyebrow">
            {ro ? "În pregătire" : "In preparation"}
          </div>
          <h2>
            {ro
              ? "Fotografii care devin cărți."
              : "Photographs becoming books."}
          </h2>
          <p>
            {ro
              ? "Două lucrări în pregătire: o selecție din fotografia mea și o carte despre Moldova."
              : "Two works in progress: a selection across my photography, and a book about Moldova."}
          </p>
        </div>
        <Link className="textlink" href="/books">
          {ro ? "Cărți în pregătire" : "Books in progress"} ↗
        </Link>
      </section>
    </>
  );
}

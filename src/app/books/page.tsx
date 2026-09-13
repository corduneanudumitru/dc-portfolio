import Link from "next/link";
import { getPortfolio } from "@/portfolio/data";
import { getLocale } from "@/portfolio/locale";
import Photo from "@/components/portfolio/Photo";
export const metadata = { title: "Books in preparation" };
export default async function Books() {
  const [{ collections, home }, locale] = await Promise.all([
    getPortfolio(),
    getLocale(),
  ]);
  const ro = locale === "ro";
  const photos = [
    collections.find((c) => c.slug === "street-theatre")?.cover,
    collections.find((c) => c.slug === "jerusalem")?.cover,
  ].filter((p) => !!p);
  return (
    <>
      <header className="page-intro">
        <div className="eyebrow">
          {ro ? "În pregătire" : "Work in progress"}
        </div>
        <h1>{ro ? "Cărți" : "Books"}</h1>
        <p>
          {ro
            ? "Două corpuri de lucrări care prind formă pe pagină."
            : "Two bodies of work taking shape on the page."}
        </p>
      </header>
      {[
        {
          title: ro ? "Lucrări selectate" : "Selected work",
          photos,
          href: "/work",
          text: ro
            ? "O carte care reunește fotografii din întreaga mea activitate: întâlniri pe stradă, portrete și călătorii."
            : "A book bringing together photographs from across my work: encounters on the street, portraits and journeys.",
        },
        {
          title: "Moldova",
          photos: home.moldovaPhotos,
          href: "/collections/moldova",
          text: ro
            ? "Un corp de lucrări personal despre Moldova, dezvoltat prin oamenii și locurile pe care le întâlnesc."
            : "A personal body of work about Moldova, developing through the people and places I encounter.",
        },
      ].map((b) => (
        <section className="book-row" key={b.title}>
          <div className="book-pictures">
            {b.photos.map((p) => (
              <Photo key={p.id} photo={p} locale={locale} />
            ))}
          </div>
          <div>
            <div className="eyebrow">
              {ro
                ? "În pregătire · Titlu de lucru"
                : "In preparation · Working title"}
            </div>
            <h2>{b.title}</h2>
            <p>{b.text}</p>
            <Link className="textlink" href={b.href}>
              {ro ? "Explorează fotografiile" : "Explore the photographs"} ↗
            </Link>
          </div>
        </section>
      ))}
    </>
  );
}

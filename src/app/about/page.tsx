import Link from "next/link";
import { getPortfolio } from "@/portfolio/data";
import { getLocale } from "@/portfolio/locale";
import Photo from "@/components/portfolio/Photo";
export const metadata = { title: "About" };
export default async function About() {
  const [{ collections }, locale] = await Promise.all([
    getPortfolio(),
    getLocale(),
  ]);
  const ro = locale === "ro";
  const photo = collections.find((c) => c.slug === "close-to-home")?.cover;
  const en = [
    "For years, I photographed mainly when I travelled. Street photography has since become a daily interest: people, gestures and unexpected relationships, wherever I find myself.",
    "Alongside this work, I continue to photograph Moldova, building a personal body of work about the people and places I encounter.",
    "My photographs from Easter in Jerusalem and Lalibela were exhibited at the National Museum of Art of Moldova.",
    "I am preparing two books: one drawing from across my photography, and another devoted to Moldova.",
  ];
  const romanian = [
    "Ani de zile am fotografiat mai ales în călătorii. Fotografia stradală a devenit apoi un interes zilnic: oameni, gesturi și relații neașteptate, oriunde mă aflu.",
    "În paralel, continui să fotografiez Moldova, construind un corp de lucrări personal despre oamenii și locurile pe care le întâlnesc.",
    "Fotografiile mele de la Paștele din Ierusalim și Lalibela au fost expuse la Muzeul Național de Artă al Moldovei.",
    "Pregătesc două cărți: una cu fotografii din întreaga mea activitate și alta dedicată Moldovei.",
  ];
  return (
    <>
      <header className="page-intro">
        <div className="eyebrow">{ro ? "Despre" : "About"}</div>
        <h1>Dumitru Corduneanu</h1>
      </header>
      <div className="two-grid">
        <div className="prose">
          {(ro ? romanian : en).map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link className="textlink" href="/contact">
            {ro ? "Ia legătura" : "Get in touch"} ↗
          </Link>
        </div>
        {photo && (
          <Link href="/collections/close-to-home">
            <Photo photo={photo} priority locale={locale} />
          </Link>
        )}
      </div>
    </>
  );
}

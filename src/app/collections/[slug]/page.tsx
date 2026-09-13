import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/portfolio/data";
import { getLocale } from "@/portfolio/locale";
import Gallery from "@/components/portfolio/Gallery";
import { kindRo } from "@/components/portfolio/Cards";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { collections } = await getPortfolio();
  const c = collections.find((c) => c.slug === slug);
  return c
    ? {
        title: c.title,
        description: c.description,
        openGraph: {
          images: [
            {
              url: c.cover.src,
              width: c.cover.width,
              height: c.cover.height,
              alt: c.cover.alt,
            },
          ],
        },
      }
    : {};
}
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { collections }, locale] = await Promise.all([
    params,
    getPortfolio(),
    getLocale(),
  ]);
  const c = collections.find((c) => c.slug === slug);
  if (!c) notFound();
  const next = collections[(collections.indexOf(c) + 1) % collections.length];
  const ro = locale === "ro";
  const kind = ro ? kindRo[c.kind] : c.kind;
  let description = ro && c.descriptionRo ? c.descriptionRo : c.description;
  if (c.slug === "moldova")
    description = ro
      ? "Fotografiez oamenii și locurile pe care le întâlnesc în Moldova. Sper ca cineva de aici să recunoască ceva din propria viață, iar cineva din altă parte să descopere ceva necunoscut. Aceste fotografii vor deveni corpul meu de lucrări despre Moldova, modelat de locurile unde merg și de ceea ce îmi atrage atenția."
      : "I photograph the people and places I encounter in Moldova. I hope someone here might recognise something of their own life, and someone elsewhere might discover something unfamiliar. These photographs will become my body of work about Moldova, shaped by where I go and what draws my attention.";
  return (
    <>
      <header className="page-intro gallery-intro">
        <Link className="eyebrow" href={"/work?kind=" + c.kind.toLowerCase()}>
          {kind} /
        </Link>
        <h1>{ro && c.titleRo ? c.titleRo : c.title}</h1>
        <p>{description}</p>
      </header>
      <Gallery key={c.id} collection={c} locale={locale} />
      <div className="gallery-end">
        <Link className="textlink" href={"/work?kind=" + c.kind.toLowerCase()}>
          ← {kind}
        </Link>
        <Link href={"/collections/" + next.slug}>
          <span className="eyebrow">
            {ro ? "Următoarea colecție" : "Next collection"}
          </span>
          <h2>{ro && next.titleRo ? next.titleRo : next.title} ↗</h2>
        </Link>
      </div>
    </>
  );
}

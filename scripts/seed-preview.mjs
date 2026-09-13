import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (dataset !== "redesign-preview")
  throw new Error(
    "This migration only permits redesign-preview; production is forbidden.",
  );
const manifestPath = process.argv[2];
if (!manifestPath)
  throw new Error(
    "Pass the private selection manifest path. It is never copied into the repository.",
  );
const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const html = fs.readFileSync(
  path.join(path.dirname(manifestPath), "website-mockup-combined.html"),
  "utf8",
);
const layouts = JSON.parse(html.match(/const galleryLayouts=(.*?);/s)[1]);
const token =
  process.env.SANITY_API_TOKEN ||
  JSON.parse(
    fs.readFileSync(
      path.join(process.env.HOME, ".config/sanity/config.json"),
      "utf8",
    ),
  ).authToken;
const client = createClient({
  projectId: "x1g6b84l",
  dataset,
  apiVersion: "2026-03-07",
  token,
  useCdn: false,
});
let assets = await client.fetch(
  '*[_type=="sanity.imageAsset"]{_id,originalFilename,url}',
);
const romanian=JSON.parse(fs.readFileSync(new URL("./romanian-copy.json",import.meta.url),"utf8"));
const mapping = [];
async function preparePhoto(p) {
  const id = "photograph." + p.id;
  const existing = await client.getDocument(id);
  if (existing) {
    mapping.push({
      sourceId: p.id,
      photoId: id,
      assetId: existing.image.asset._ref,
    });
    return;
  }
  let asset;
  if (p.source === "website") {
    const filename = new URL(p.source_url).pathname.split("/").pop();
    asset = assets.find((a) => a.url.endsWith("/" + filename));
    if (!asset)
      throw new Error("Missing restored full-resolution asset for " + p.id);
  } else {
    asset = await client.assets.upload(
      "image",
      fs.createReadStream(p.original),
      { filename: p.id + path.extname(p.original) },
    );
  }
  await client.createIfNotExists({
    _id: id,
    _type: "photograph",
    sourceId: p.id,
    title: p.id,
    alt: p.alt,
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    metadataConfidence: p.location_confidence,
    location: p.location_confidence?.startsWith("High")
      ? p.location
      : undefined,
  });
  mapping.push({ sourceId: p.id, photoId: id, assetId: asset._id });
  console.log("Prepared photograph", p.id);
}
const pending = Object.values(data.photos);
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < pending.length) {
      const p = pending[cursor++];
      await preparePhoto(p);
    }
  }),
);
for (const [order, c] of data.collections.entries()) {
  let i = 0;
  const groups = layouts[c.slug].map((size, row) => ({
    _key: "row-" + row,
    _type: "photoGroup",
    photos: c.ids.slice(i, (i += size)).map((id) => ({
      _key: id,
      _type: "reference",
      _ref: "photograph." + id,
    })),
  }));
  await client.createIfNotExists({
    _id: "collection." + c.slug,
    _type: "collection",
    title: c.title,
    titleRo: romanian[c.slug]?.[0],
    descriptionRo: romanian[c.slug]?.[1],
    slug: { _type: "slug", current: c.slug },
    kind: c.kind,
    description: c.description,
    order,
    cover: { _type: "reference", _ref: "photograph." + c.cover },
    homeCover: {
      _type: "reference",
      _ref:
        "photograph." +
        ({ "small-exchanges": "A2184", encounters: "work_bhutan-044" }[
          c.slug
        ] || c.cover),
    },
    groups,
    selectionPurpose: "website",
  });
}
await client.createIfNotExists({
  _id: "portfolio-home",
  _type: "portfolioHome",
  title: "People, places, passing moments.",
  opening: ["through-glass", "street-theatre", "small-exchanges"].map(
    (slug) => ({ _key: slug, _type: "reference", _ref: "collection." + slug }),
  ),
  secondary: ["weather", "urban-geometry", "after-dark"].map((slug) => ({
    _key: slug,
    _type: "reference",
    _ref: "collection." + slug,
  })),
  moldovaPhotos: ["A1329", "A2092"].map((id) => ({
    _key: id,
    _type: "reference",
    _ref: "photograph." + id,
  })),
});
fs.writeFileSync(
  "scripts/migration-map.json",
  JSON.stringify(
    {
      dataset,
      photos: mapping,
      collections: data.collections.map((c) => ({
        sourceSlug: c.slug,
        id: "collection." + c.slug,
      })),
    },
    null,
    2,
  ),
);
console.log(
  "Seed verified",
  mapping.length,
  "photographs,",
  data.collections.length,
  "collections",
);

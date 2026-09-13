import assert from "node:assert/strict";
import { createClient } from "@sanity/client";
import fs from "node:fs";
const client = createClient({
  projectId: "x1g6b84l",
  dataset: "redesign-preview",
  apiVersion: "2026-03-07",
  useCdn: false,
});
const manifest = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const [collections, photos, assets, legacy] = await Promise.all([
  client.fetch('*[_type=="collection"]'),
  client.fetch(
    '*[_type=="photograph"]{...,"dimensions":image.asset->metadata.dimensions}',
  ),
  client.fetch('count(*[_type=="sanity.imageAsset"])'),
  client.fetch('count(*[_type=="project"])'),
]);
assert.equal(collections.length, 17);
assert.equal(photos.length, 161);
assert.equal(legacy, 21);
for (const expected of manifest.collections) {
  const c = collections.find((c) => c.slug.current === expected.slug);
  assert.deepEqual(
    c.groups.flatMap((g) =>
      g.photos.map((p) => p._ref.replace("photograph.", "")),
    ),
    expected.ids,
  );
  assert(c.groups.every((g) => g.photos.length >= 1 && g.photos.length <= 3));
}
for (const p of photos) {
  assert(p.dimensions?.width > 0 && p.dimensions.height > 0);
  assert(!JSON.stringify(p).includes("/Users/"));
}
assert.equal(
  collections.find((c) => c.slug.current === "small-exchanges").homeCover._ref,
  "photograph.A2184",
);
assert.equal(
  collections.find((c) => c.slug.current === "encounters").homeCover._ref,
  "photograph.work_bhutan-044",
);
console.log(
  JSON.stringify(
    {
      collections: collections.length,
      photographs: photos.length,
      assets,
      legacyProjects: legacy,
      orderAndMembership: "all match",
      homepageCovers: "match",
      sourcePaths: "absent",
    },
    null,
    2,
  ),
);

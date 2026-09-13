import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (dataset !== "redesign-preview")
  throw new Error("Only redesign-preview is permitted.");
const client = createClient({
  projectId: "x1g6b84l",
  dataset,
  apiVersion: "2026-03-07",
  useCdn: false,
  token:
    process.env.SANITY_API_TOKEN ||
    JSON.parse(
      fs.readFileSync(
        path.join(process.env.HOME, ".config/sanity/config.json"),
        "utf8",
      ),
    ).authToken,
});
const file = process.argv[3];
if (!file)
  throw new Error("Pass a private restore record path outside the repository.");
const ids = ["photograph-A0437", "collection-through-glass"];
if (process.argv[2] === "apply") {
  if (fs.existsSync(file))
    throw new Error("Restore record already exists; do not overwrite.");
  const [photo, collection, replacement] = await Promise.all([
    client.getDocument(ids[0]),
    client.getDocument(ids[1]),
    client.getDocument("photograph-A2184"),
  ]);
  const groups = structuredClone(collection.groups);
  [groups[1].photos[0], groups[1].photos[1]] = [
    groups[1].photos[1],
    groups[1].photos[0],
  ];
  const saved = {
    photo: { _id: photo._id, image: photo.image },
    collection: {
      _id: collection._id,
      groups: collection.groups,
      homeCover: collection.homeCover,
    },
    changedRevisions: {},
  };
  fs.writeFileSync(file, JSON.stringify(saved, null, 2), { mode: 0o600 });
  await client
    .transaction()
    .patch(photo._id, (p) =>
      p.ifRevisionId(photo._rev).set({ image: replacement.image }),
    )
    .patch(collection._id, (p) =>
      p.ifRevisionId(collection._rev).set({
        groups,
        homeCover: { _type: "reference", _ref: "photograph-A2184" },
      }),
    )
    .commit();
  const after = await client.getDocuments(ids);
  saved.changedRevisions = Object.fromEntries(
    after.map((d) => [d._id, d._rev]),
  );
  fs.writeFileSync(file, JSON.stringify(saved, null, 2));
  console.log(
    "Applied isolated orientation replacement, sequence reorder and homepage cover change.",
  );
} else if (process.argv[2] === "restore") {
  const saved = JSON.parse(fs.readFileSync(file, "utf8"));
  let tx = client.transaction();
  for (const key of ["photo", "collection"]) {
    const { _id, ...fields } = saved[key];
    if (!saved.changedRevisions[_id])
      throw new Error("Missing changed revision; inspect before restoring.");
    tx = tx.patch(_id, (p) =>
      p.ifRevisionId(saved.changedRevisions[_id]).set(fields),
    );
  }
  await tx.commit();
  console.log("Original preview photographs and sequence restored.");
} else throw new Error("Use apply or restore.");

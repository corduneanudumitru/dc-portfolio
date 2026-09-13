import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
if (process.env.NEXT_PUBLIC_SANITY_DATASET !== "redesign-preview")
  throw new Error("Only redesign-preview is permitted.");
const client = createClient({
  projectId: "x1g6b84l",
  dataset: "redesign-preview",
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
const copy = JSON.parse(
  fs.readFileSync(new URL("./romanian-copy.json", import.meta.url), "utf8"),
);
for (const [slug, [titleRo, descriptionRo]] of Object.entries(copy))
  await client
    .patch("collection-" + slug)
    .setIfMissing({ titleRo, descriptionRo })
    .commit();
console.log(
  "Romanian collection copy populated without replacing existing translations.",
);

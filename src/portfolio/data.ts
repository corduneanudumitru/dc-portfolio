import "server-only";
import { cache } from "react";
import { client } from "@/sanity/lib/client";
export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  altRo?: string;
}
export interface Collection {
  id: string;
  slug: string;
  title: string;
  titleRo?: string;
  kind: string;
  description: string;
  descriptionRo?: string;
  cover: Photo;
  homeCover?: Photo;
  groups: { key: string; photos: Photo[] }[];
}
export interface Portfolio {
  collections: Collection[];
  home: {
    title: string;
    titleRo?: string;
    opening: string[];
    secondary: string[];
    moldovaPhotos: Photo[];
  };
}
const photo = `{"id":_id,"src":image.asset->url,"width":image.asset->metadata.dimensions.width,"height":image.asset->metadata.dimensions.height,alt,altRo}`;
export const getPortfolio = cache(async (): Promise<Portfolio> => {
  const result = await client.withConfig({ useCdn: false }).fetch<Portfolio>(
    `{
 "collections":*[_type=="collection" && selectionPurpose=="website"]|order(order asc){"id":_id,"slug":slug.current,title,titleRo,kind,description,descriptionRo,"cover":cover->${photo},"homeCover":homeCover->${photo},"groups":groups[]{"key":_key,"photos":photos[]->${photo}}},
 "home":*[_id=="portfolio-home"][0]{title,titleRo,"opening":opening[]->slug.current,"secondary":secondary[]->slug.current,"moldovaPhotos":moldovaPhotos[]->${photo}}
 }`,
    {},
    { cache: "no-store" },
  );
  // A missing/unpublished reference must not break all galleries while editing.
  result.collections = result.collections
    .map((c) => ({
      ...c,
      groups: (c.groups || [])
        .map((g) => ({
          ...g,
          photos: (g.photos || []).filter(
            (p) => p?.src && p.width > 0 && p.height > 0,
          ),
        }))
        .filter((g) => g.photos.length),
    }))
    .filter((c) => c.cover?.src && c.groups.length);
  result.home.moldovaPhotos = (result.home.moldovaPhotos || []).filter(
    (p) => p?.src && p.width > 0 && p.height > 0,
  );
  return result;
});

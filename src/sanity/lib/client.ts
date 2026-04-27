import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables'
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use Sanity's CDN for read queries — ~3–5x faster, eventual consistency up to 60s.
  // Override with useCdn: false in the client call for draft-mode or admin paths.
  useCdn: true,
  perspective: 'published',
});

export const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

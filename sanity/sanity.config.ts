import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables'
  );
}

export default defineConfig({
  name: 'default',
  title: 'Photography Portfolio CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Projects')
              .schemaType('project')
              .child(
                S.documentList()
                  .title('Projects')
                  .schemaType('project')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Blog Posts')
              .schemaType('post')
              .child(
                S.documentList()
                  .title('Blog Posts')
                  .schemaType('post')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Navigation')
              .schemaType('navigation')
              .child(
                S.document()
                  .schemaType('navigation')
                  .documentId('navigation')
                  .title('Navigation')
              ),
            S.listItem()
              .title('Site Settings')
              .schemaType('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
            S.listItem()
              .title('About Page')
              .schemaType('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
                  .title('About Page')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});

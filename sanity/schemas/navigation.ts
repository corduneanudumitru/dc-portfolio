import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        defineType({
          name: 'navItem',
          title: 'Navigation Item',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The text displayed in the navigation',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL/Path',
              type: 'string',
              description: 'URL or path (e.g., "/projects", "/blog", or "https://example.com")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isExternal',
              title: 'External Link',
              type: 'boolean',
              description: 'Check if this links to an external site',
              initialValue: false,
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Display order (lower numbers appear first)',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              href: 'href',
              order: 'order',
              isExternal: 'isExternal',
            },
            prepare(selection) {
              const { title, href, order, isExternal } = selection;
              return {
                title,
                subtitle: `${order}. ${href} ${isExternal ? '(external)' : ''}`,
              };
            },
          },
        }),
      ],
      description: 'Add and arrange navigation items in order',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Navigation',
        subtitle: 'Main site navigation menu',
      };
    },
  },
});

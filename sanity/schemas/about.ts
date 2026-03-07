import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'portrait',
      title: 'Portrait Image',
      type: 'image',
      description: 'Your portrait or professional photo',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Title for the about page (e.g., "About Me")',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'blockContent',
      description: 'Complete biography with formatted text and images',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 2,
      description: 'Brief bio for homepage teaser (2-3 sentences)',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'equipment',
      title: 'Equipment',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Photography equipment you use (cameras, lenses, etc.)',
    }),
    defineField({
      name: 'exhibitions',
      title: 'Exhibitions & Shows',
      type: 'array',
      of: [
        defineType({
          name: 'exhibition',
          title: 'Exhibition',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Exhibition Title',
              type: 'string',
              description: 'Name of the exhibition or show',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'venue',
              title: 'Venue',
              type: 'string',
              description: 'Where the exhibition took place',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
              description: 'Year of the exhibition',
              validation: (Rule) => Rule.required().min(1900).max(2100),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              venue: 'venue',
              year: 'year',
            },
            prepare(selection) {
              const { title, venue, year } = selection;
              return {
                title,
                subtitle: `${venue} • ${year}`,
              };
            },
          },
        }),
      ],
      description: 'Add exhibitions and shows you have participated in',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'Photographer biography and background',
      };
    },
  },
});

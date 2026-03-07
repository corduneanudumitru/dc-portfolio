import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Photography Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'The title of the photography project',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().unique(),
      description: 'URL-friendly version of the title (auto-generated)',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'The main/hero image for this project',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Gallery Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Image Caption',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
      description: 'Images that belong to this project',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Street', value: 'street' },
          { title: 'Travel', value: 'travel' },
          { title: 'Landscape', value: 'landscape' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Architecture', value: 'architecture' },
          { title: 'Documentary', value: 'documentary' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Searchable tags for the project',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview of the project (used in listings)',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'body',
      title: 'Project Details',
      type: 'blockContent',
      description: 'Full project description with formatted text and images',
    }),
    defineField({
      name: 'imageCount',
      title: 'Image Count',
      type: 'number',
      description: 'Total number of images in the project',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where this project was photographed',
    }),
    defineField({
      name: 'date',
      title: 'Project Date',
      type: 'date',
      description: 'When this project was completed',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Display this project prominently on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for sorting projects (lower numbers appear first)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this project was published',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'date',
      category: 'category',
    },
    prepare(selection) {
      const { title, media, date, category } = selection;
      const formattedDate = date ? new Date(date).getFullYear() : '';
      return {
        title,
        media,
        subtitle: `${category ? category.toUpperCase() : 'Uncategorized'} ${formattedDate ? `• ${formattedDate}` : ''}`,
      };
    },
  },
});

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'The title of the blog post',
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
      description: 'Featured image for the post',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown in blog listings',
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'body',
      title: 'Post Content',
      type: 'blockContent',
      description: 'Full post content with formatted text and images',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Photo Essay', value: 'photo-essay' },
          { title: 'Travel Notes', value: 'travel-notes' },
          { title: 'Gear', value: 'gear' },
          { title: 'Behind the Images', value: 'behind-the-images' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this post was published',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'publishedAt',
      category: 'category',
    },
    prepare(selection) {
      const { title, media, date, category } = selection;
      const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) : '';
      return {
        title,
        media,
        subtitle: `${category ? category.toUpperCase() : 'Uncategorized'} ${formattedDate ? `• ${formattedDate}` : ''}`,
      };
    },
  },
});

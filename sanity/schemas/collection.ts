import { defineType, defineField, defineArrayMember } from "sanity";
export default defineType({
  name: "collection",
  title: "Website collections",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "titleRo", title: "Title (Romanian)", type: "string" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["Themes", "Projects", "Portraits", "Studies"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "descriptionRo",
      title: "Description (Romanian)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "cover",
      title: "Collection cover",
      type: "reference",
      to: [{ type: "photograph" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "homeCover",
      title: "Homepage cover (optional override)",
      type: "reference",
      to: [{ type: "photograph" }],
    }),
    defineField({ name: "order", type: "number" }),
    defineField({
      name: "selectionPurpose",
      type: "string",
      initialValue: "website",
      readOnly: true,
      description:
        "Website selection. Book and exhibition selections are independent.",
    }),
    defineField({
      name: "groups",
      title: "Sequence — drag groups or photographs to reorder",
      type: "array",
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          name: "photoGroup",
          title: "Image group",
          type: "object",
          fields: [
            defineField({
              name: "photos",
              title: "Photographs — one, two or three",
              type: "array",
              of: [{ type: "reference", to: [{ type: "photograph" }] }],
              validation: (r) => r.required().min(1).max(3),
            }),
          ],
          preview: {
            select: {
              media: "photos.0.image",
              a: "photos.0.title",
              b: "photos.1.title",
              c: "photos.2.title",
            },
            prepare: ({ media, a, b, c }) => ({
              title: [a, b, c].filter(Boolean).join(" · ") || "New image group",
              media,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Website order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "kind", media: "cover.image" },
  },
});

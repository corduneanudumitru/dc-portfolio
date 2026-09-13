import { defineType, defineField } from "sanity";
export default defineType({
  name: "photograph",
  title: "Photographs",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: false },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "alt",
      title: "Image description (English)",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "altRo",
      title: "Image description (Romanian)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "location",
      title: "Confirmed location",
      type: "string",
    }),
    defineField({
      name: "metadataConfidence",
      title: "Metadata confidence / needs confirmation",
      type: "string",
    }),
    defineField({
      name: "sourceId",
      title: "Original selection identifier",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: { select: { title: "title", subtitle: "alt", media: "image" } },
});

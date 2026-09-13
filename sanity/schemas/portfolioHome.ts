import { defineType, defineField } from "sanity";
export default defineType({
  name: "portfolioHome",
  title: "Portfolio homepage",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "titleRo",
      title: "Headline (Romanian)",
      type: "string",
    }),
    ...["opening", "secondary"].map((name) =>
      defineField({
        name,
        title: name === "opening" ? "Opening collections" : "Secondary themes",
        type: "array",
        of: [{ type: "reference", to: [{ type: "collection" }] }],
        validation: (r) => r.required().length(3),
      }),
    ),
    defineField({
      name: "moldovaPhotos",
      title: "Moldova feature photographs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photograph" }] }],
      validation: (r) => r.required().length(2),
    }),
  ],
});

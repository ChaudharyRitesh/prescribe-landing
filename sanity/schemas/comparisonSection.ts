import { defineField, defineType } from "sanity";

export default defineType({
  name: "comparisonSection",
  title: "Comparison Section",
  type: "document",
  fields: [
    {
      name: "feature",
      title: "Feature Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "kaero",
      title: "KaeroPrescribe Has This",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "traditional",
      title: "Traditional Systems Have This",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "feature",
      kaero: "kaero",
      traditional: "traditional",
    },
    prepare({ title, kaero, traditional }) {
      return {
        title,
        subtitle: `KaeroPrescribe: ${kaero ? "✓" : "✗"} | Traditional: ${traditional ? "✓" : "✗"}`,
      };
    },
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutSection",
  title: "About Section",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
     of:[{type:"block"}]
    },
    {
      name: "image",
      title: "Section Image",
      type: "object",
      fields: [
        {
          name: "imageUpload",
          title: "Upload Image",
          type: "image",
          options: { hotspot: true },
        },
        { name: "imageUrl", title: "Or Image URL", type: "url" },
      ],
    },
    {
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "number", title: "Number", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
        },
      ],
    },
    {
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    },
    {
      name: "ctaLink",
      title: "CTA Button Link",
      type: "url",
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "image.imageUpload",
    },
  },
});

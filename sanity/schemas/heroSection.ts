import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Main Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "text",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", type: "string", title: "Button Text" },
            { name: "link", type: "string", title: "Link" },
            {
              name: "variant",
              type: "string",
              title: "Variant",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            },
          ],
          preview: {
            select: {
              title: "text",
              subtitle: "link",
            },
          },
        },
      ],
    },
    {
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "description",
              title: "Description",
              type: "text",
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
        },
      ],
    },
    // Deprecated Fields (kept for data visual/migration)
    {
      name: "ctaText",
      title: "CTA Button Text (Deprecated)",
      type: "string",
    },
    {
      name: "ctaLink",
      title: "CTA Button Link (Deprecated)",
      type: "url",
    },
    {
      name: "backgroundImage",
      title: "Background Image (Deprecated)",
      type: "object",
      fields: [
        {
          name: "imageUpload",
          title: "Upload Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          name: "imageUrl",
          title: "Or Image URL",
          type: "url",
        },
      ],
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
    },
  },
});

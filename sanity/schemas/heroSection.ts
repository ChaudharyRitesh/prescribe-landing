import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string'
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'url'
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage.imageUpload'
    }
  }
})

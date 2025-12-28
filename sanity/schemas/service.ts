import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text'
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'serviceImage',
      title: 'Service Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    },
    {
      name: 'features',
      title: 'Service Features',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'price',
      title: 'Starting Price',
      type: 'string'
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Learn More'
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'url'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'serviceImage.imageUpload'
    }
  }
})

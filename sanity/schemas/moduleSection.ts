import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'moduleSection',
  title: 'Module Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., Zap, Users, Clock, BarChart3)'
    },
    {
      name: 'image',
      title: 'Module Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    },
    {
      name: 'features',
      title: 'Features List',
      type: 'array',
      of: [{type: 'string'}]
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
      subtitle: 'description',
      media: 'image.imageUpload'
    }
  }
})

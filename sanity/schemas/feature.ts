import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'feature',
  title: 'Features',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Feature Title',
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
      title: 'Feature Icon/Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Icon/Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Icon/Image URL', type: 'url'}
      ]
    },
    {
      name: 'link',
      title: 'Feature Link (Optional)',
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
      subtitle: 'description',
      media: 'icon.imageUpload'
    }
  }
})

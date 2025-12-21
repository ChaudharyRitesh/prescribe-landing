import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'feature',
  title: 'Features',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Feature Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'icon',
      title: 'Feature Icon/Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Icon/Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Icon/Image URL', type: 'url'}
      ]
    }),
    defineField({
      name: 'link',
      title: 'Feature Link (Optional)',
      type: 'url'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number'
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    })
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

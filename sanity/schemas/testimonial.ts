import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'position',
      title: 'Position/Title',
      type: 'string'
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string'
    },
    {
      name: 'testimonial',
      title: 'Testimonial Text',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: Rule => Rule.min(1).max(5)
    },
    {
      name: 'avatar',
      title: 'Customer Photo',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Photo', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Photo URL', type: 'url'}
      ]
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
      title: 'name',
      subtitle: 'company',
      media: 'avatar.imageUpload'
    }
  },
 
})

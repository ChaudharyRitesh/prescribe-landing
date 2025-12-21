import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'number', title: 'Number', type: 'string'},
          {name: 'label', title: 'Label', type: 'string'}
        ]
      }]
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string'
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'url'
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image.imageUpload'
    }
  }
})

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comparisonSection',
  title: 'Comparison Section',
  type: 'document',
  fields: [
    defineField({
      name: 'feature',
      title: 'Feature Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'kaero',
      title: 'KaeroCare Has This',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'traditional',
      title: 'Traditional Systems Have This',
      type: 'boolean',
      initialValue: false
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
      title: 'feature',
      kaero: 'kaero',
      traditional: 'traditional'
    },
    prepare({title, kaero, traditional}) {
      return {
        title,
        subtitle: `KaeroCare: ${kaero ? '✓' : '✗'} | Traditional: ${traditional ? '✓' : '✗'}`
      }
    }
  }
})

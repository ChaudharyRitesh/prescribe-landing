import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pricingPlan',
  title: 'Pricing Plans',
  type: 'document',
  fields: [
    defineField({
      name: 'planName',
      title: 'Plan Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD'
    }),
    defineField({
      name: 'billingPeriod',
      title: 'Billing Period',
      type: 'string',
      options: {
        list: [
          {title: 'Monthly', value: 'month'},
          {title: 'Yearly', value: 'year'},
          {title: 'One-time', value: 'onetime'}
        ]
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'planImage',
      title: 'Plan Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    }),
    defineField({
      name: 'isPopular',
      title: 'Popular Plan',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Get Started'
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
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
      title: 'planName',
      subtitle: 'price',
      media: 'planImage.imageUpload'
    }
  }
})

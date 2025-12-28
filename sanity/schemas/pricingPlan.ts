import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'pricingPlan',
  title: 'Pricing Plans',
  type: 'document',
  fields: [
    {
      name: 'planName',
      title: 'Plan Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD'
    },
    {
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
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'planImage',
      title: 'Plan Image',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Image URL', type: 'url'}
      ]
    },
    {
      name: 'isPopular',
      title: 'Popular Plan',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Get Started'
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
      title: 'planName',
      subtitle: 'price',
      media: 'planImage.imageUpload'
    }
  }
})

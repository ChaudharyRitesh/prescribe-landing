import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text'
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Logo', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Logo URL', type: 'url'}
      ]
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Favicon', type: 'image'},
        {name: 'imageUrl', title: 'Or Favicon URL', type: 'url'}
      ]
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Brand Color',
      type: 'string'
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Brand Color',
      type: 'string'
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text'
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string'
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string'
    })
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo.imageUpload'
    }
  }
})

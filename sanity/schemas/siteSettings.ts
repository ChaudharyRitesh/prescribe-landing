import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text'
    },
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Logo', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Logo URL', type: 'url'}
      ]
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Favicon', type: 'image'},
        {name: 'imageUrl', title: 'Or Favicon URL', type: 'url'}
      ]
    },
    {
      name: 'primaryColor',
      title: 'Primary Brand Color',
      type: 'string'
    },
    {
      name: 'secondaryColor',
      title: 'Secondary Brand Color',
      type: 'string'
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'text'
    },
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string'
    },
    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
    }
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo.imageUpload'
    }
  }
})

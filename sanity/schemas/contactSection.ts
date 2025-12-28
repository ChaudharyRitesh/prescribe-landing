import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text'
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'email'
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text'
    },
    {
      name: 'workingHours',
      title: 'Working Hours',
      type: 'string'
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
            {
              name: 'icon',
              title: 'Icon',
              type: 'object',
              fields: [
                {name: 'imageUpload', title: 'Upload Icon', type: 'image'},
                {name: 'imageUrl', title: 'Or Icon URL', type: 'url'}
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'mapImage',
      title: 'Location Map',
      type: 'object',
      fields: [
        {name: 'imageUpload', title: 'Upload Map Image', type: 'image', options: {hotspot: true}},
        {name: 'imageUrl', title: 'Or Map Image URL', type: 'url'}
      ]
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'email'
    }
  }
})

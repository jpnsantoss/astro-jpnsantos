import { orderRankField } from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    orderRankField({ type: 'experience' }), 
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      type: 'object',
      title: 'Company',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'logo',
          type: 'file',
          title: 'Logo',
          options: {
            accept: 'image/*',
          },
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      type: 'string',
      title: 'Start Date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'string',
      title: 'End Date',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
  ],
})

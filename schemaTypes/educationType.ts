import { orderRankField } from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    orderRankField({ type: 'education' }), 
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'institution',
      type: 'object',
      title: 'Institution',
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
      validation: (rule) => rule.required(),
    }),
  ],
})

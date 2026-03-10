import { orderRankField } from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    orderRankField({ type: 'skill' }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'skills',
      type: 'array',
      title: 'Skills',
      of: [{type: 'string'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'Color',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Yellow', value: 'yellow' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
})

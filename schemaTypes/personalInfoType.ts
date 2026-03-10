import {defineField, defineType} from 'sanity'

export const personalInfoType = defineType({
  name: 'personalInfo',
  title: 'Personal Info',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'profilePicture',
      type: 'image',
      title: 'Profile Picture',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resume',
      type: 'file',
      title: 'Resume',
      options: {
        accept: '.pdf',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'github',
      type: 'url',
      title: 'GitHub',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'instagram',
      type: 'url',
      title: 'Instagram',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'twitter',
      type: 'url',
      title: 'Twitter',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'aboutMe',
      type: 'array',
      title: 'About Me',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
  ],
})

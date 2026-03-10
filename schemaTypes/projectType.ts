import { defineType, defineField } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    orderRankField({ type: "project" }), 
    defineField({ 
      name: 'title', 
      title: 'Project Title', 
      type: 'string',
      description: 'The display name of your project' 
    }),
    defineField({ 
      name: 'name', 
      title: 'Repository / Short Name', 
      type: 'string',
      description: 'e.g., astro-portfolio or e-commerce-app' 
    }),
    defineField({ 
      name: 'description', 
      title: 'Short Description', 
      type: 'text',
      description: 'A brief summary of what the project is'
    }),
    defineField({ 
      name: 'detailedDescription', 
      title: 'Detailed Description', 
      type: 'text',
      description: 'A longer explanation of the project, challenges, etc.'
    }),
    defineField({ 
      name: 'tools', 
      title: 'Tools & Tech Stack', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'e.g., React, Tailwind, Astro' 
    }),
    defineField({ 
      name: 'githubUrl', 
      title: 'GitHub Repository URL', 
      type: 'url' 
    }),
    defineField({ 
      name: 'liveUrl', 
      title: 'Live Demo URL', 
      type: 'url' 
    }),
    defineField({ 
      name: 'thumbnail', 
      title: 'Project Thumbnail', 
      type: 'image', 
      options: { hotspot: true } // Allows you to crop the image in the studio
    })
  ]
})
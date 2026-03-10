import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'jpnsantos',
  projectId: 'dbowprqv',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({ type: 'project', title: 'Projects', S, context }),
            orderableDocumentListDeskItem({ type: 'skill', title: 'Skills', S, context }),
            orderableDocumentListDeskItem({ type: 'experience', title: 'Experience', S, context }),
            orderableDocumentListDeskItem({ type: 'education', title: 'Education', S, context }),
          ])
      },
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
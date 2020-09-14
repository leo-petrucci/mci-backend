import { objectType } from '@nexus/schema'
import { trimIfInNodeModules } from 'nexus-plugin-prisma/dist/schema/utils'

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.tagName()
    t.model.Servers()
  },
})

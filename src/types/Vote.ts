import { objectType } from '@nexus/schema'
import { trimIfInNodeModules } from 'nexus-plugin-prisma/dist/schema/utils'

export const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.model.id()
    t.model.author()
    t.model.server()
  },
})

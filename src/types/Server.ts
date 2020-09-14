import { objectType } from '@nexus/schema'
import { trimIfInNodeModules } from 'nexus-plugin-prisma/dist/schema/utils'

export const Server = objectType({
  name: 'Server',
  definition(t) {
    t.model.id()
    t.model.published()
    t.model.title()
    t.model.content()
    t.model.author()
    t.model.tags()
    t.model.cover()
    t.model.slots()
  },
})

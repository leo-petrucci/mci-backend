import { objectType } from '@nexus/schema'

export const Server = objectType({
  name: 'Server',
  definition(t) {
    t.model.id()
    t.model.published()
    t.model.title()
    t.model.content()
    t.model.author()
  },
})

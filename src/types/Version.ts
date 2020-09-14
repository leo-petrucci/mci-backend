import { objectType } from '@nexus/schema'

export const Version = objectType({
  name: 'Version',
  definition(t) {
    t.model.id()
    t.model.versionName()
    t.model.Servers()
  },
})

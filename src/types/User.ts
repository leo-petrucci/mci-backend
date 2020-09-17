import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.role()
    t.model.banned()
    t.model.photoUrl()
    t.model.Votes()
    t.model.Servers()
  },
})

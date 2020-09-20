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

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.tagName()
    t.model.Servers()
  },
})

export const UserPayload = objectType({
  name: 'UserPayload',
  definition(t) {
    t.field('user', { type: 'User' })
  },
})

export const Version = objectType({
  name: 'Version',
  definition(t) {
    t.model.id()
    t.model.versionName()
    t.model.Servers()
  },
})

export const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.model.id()
    t.model.author()
    t.model.server()
  },
})

export const ServerPayload = objectType({
  name: 'ServerPayload',
  definition(t) {
    t.field('server', { type: 'Server' })
  },
})

export const Server = objectType({
  name: 'Server',
  definition(t) {
    t.model.id()
    t.model.published()
    t.model.title()
    t.model.content()
    t.model.author()
    t.model.tags()
    t.model.version()
    t.model.slots()
    t.model.cover()
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.string('expiresIn')
    t.field('user', { type: 'User' })
  },
})

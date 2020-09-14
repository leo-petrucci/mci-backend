import { objectType } from '@nexus/schema'

export const ServerPayload = objectType({
  name: 'ServerPayload',
  definition(t) {
    t.field('server', { type: 'Server' })
  },
})

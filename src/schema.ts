import { makeSchema } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import * as types from './types'

export const schema = makeSchema({
  types,
  plugins: [nexusPrisma()],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    alias: 'Context',
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'client',
      },
    ],
  },
})

import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })

    t.list.field('feed', {
      type: 'Server',
      resolve: async (parent, args, ctx) => {
        const servers = await ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, count("serverId") AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") GROUP BY s.id ORDER BY "voteCount" DESC;`
        return servers
      },
    })

    t.list.field('searchServers', {
      type: 'Server',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: async (parent, { searchString }, ctx) => {
        return await ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, count("serverId") AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") WHERE title LIKE ${
          '%' + searchString + '%'
        } OR content LIKE ${
          '%' + searchString + '%'
        } GROUP BY s.id ORDER BY "voteCount" DESC;`
      },
    })

    t.field('server', {
      type: 'Server',
      nullable: true,
      args: { id: intArg() },
      resolve: async (parent, { id }, ctx) => {
        const servers = await ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, count("serverId") AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") WHERE s.id = ${id} GROUP BY s.id LIMIT 1;`
        return servers[0]
      },
    })
  },
})

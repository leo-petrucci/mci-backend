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
      resolve: (parent, args, ctx) => {
        const servers = ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, count("serverId") AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") GROUP BY s.id ORDER BY "voteCount" DESC;`
        servers.then((res) => console.log(res))
        return servers
      },
    })

    t.list.field('filterServers', {
      type: 'Server',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.server.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString || undefined,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        })
      },
    })

    t.field('server', {
      type: 'Server',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.server.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })
  },
})

import { intArg, queryType, stringArg } from '@nexus/schema'
import { getDates, getUserId } from '../utils'

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
      args: {
        date: stringArg({ default: new Date().toISOString(), nullable: false }),
        page: intArg({ default: 0, nullable: false }),
      },
      resolve: (parent, { date, page }, ctx) => {
        const pageLimit = 10
        const [d, f] = getDates(date)
        const servers = ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, sum(case WHEN v."createdAt" >= ${d} AND v."createdAt" < ${f}
          THEN 1 ELSE 0 END ) AS "voteCount" 
          FROM "Server" AS s 
          LEFT JOIN "Vote" AS v ON (s.id = "serverId")
          GROUP BY s.id ORDER BY "voteCount" DESC
          OFFSET ${page > 10 ? pageLimit * 25 : page} LIMIT 25;`
        return servers
      },
    })

    t.list.field('searchServers', {
      type: 'Server',
      args: {
        date: stringArg({ default: new Date().toISOString(), nullable: false }),
        searchString: stringArg({ nullable: true }),
        page: intArg({ default: 0, nullable: false }),
      },
      resolve: async (parent, { searchString, date, page }, ctx) => {
        const [d, f] = getDates(date)
        const pageLimit = 10
        return await ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v."createdAt" >= ${d} AND v."createdAt" < ${f}
          THEN 1 ELSE 0 END ) AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") WHERE title LIKE ${
            '%' + searchString + '%'
          } OR content LIKE ${
          '%' + searchString + '%'
        } GROUP BY s.id ORDER BY "voteCount" DESC
        OFFSET ${page > 10 ? pageLimit * 25 : page} LIMIT 25;;`
      },
    })

    t.field('server', {
      type: 'Server',
      nullable: true,
      args: {
        id: intArg(),
        date: stringArg({ default: new Date().toISOString(), nullable: false }),
      },
      resolve: async (parent, { id, date }, ctx) => {
        const [d, f] = getDates(date)
        const servers = await ctx.prisma
          .$queryRaw`SELECT s.id, s.title, s.content, s.slots, s.cover, sum(case WHEN v."createdAt" >= ${d} AND v."createdAt" < ${f}
          THEN 1 ELSE 0 END ) AS "voteCount" FROM "Server" AS s LEFT JOIN "Vote" AS v ON (s.id = "serverId") WHERE s.id = ${id} GROUP BY s.id LIMIT 1;`
        return servers[0]
      },
    })
  },
})

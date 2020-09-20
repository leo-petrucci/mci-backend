import { intArg, mutationType, stringArg, booleanArg } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  APP_SECRET,
  getUserId,
  getServerInfo,
  getVersionQuery,
  getTagsQuery,
  getMciToken,
  getMciProfile,
} from '../utils'
import { resolve } from 'dns'
import { disconnect } from 'process'

export const Mutation = mutationType({
  definition(t) {
    t.field('oAuthLogin', {
      type: 'AuthPayload',
      args: {
        code: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { code }, ctx) => {
        let token
        try {
          token = await getMciToken(code)
        } catch (error) {
          return error
        }

        let userProfile
        try {
          userProfile = await getMciProfile(token.access_token)
        } catch (error) {
          return error
        }

        const user = await ctx.prisma.user.upsert({
          where: { id: userProfile.id },
          create: {
            id: userProfile.id,
            username: userProfile.name,
            photoUrl: userProfile.photoUrl,
            email: userProfile.email,
            role: 'user',
            posts: userProfile.posts,
          },
          update: {
            username: userProfile.name,
            photoUrl: userProfile.photoUrl,
            email: userProfile.email,
            posts: userProfile.posts,
          },
        })
        return {
          token: sign({ userId: user.id, role: user.role }, APP_SECRET, {
            expiresIn: '7d',
          }),
          expiresIn: 604800,
          user,
        }
      },
    })

    t.field('updateRole', {
      type: 'UserPayload',
      args: {
        id: intArg({ nullable: false }),
        role: stringArg({ nullable: false }),
      },
      resolve: async (parent, { id, role }, ctx) => {
        const user = await ctx.prisma.user.update({
          where: { id: id },
          data: {
            role,
          },
        })
        return {
          user,
        }
      },
    })

    t.field('updateBan', {
      type: 'UserPayload',
      args: {
        id: intArg({ nullable: false }),
        banned: booleanArg({ nullable: false }),
      },
      resolve: async (parent, { banned, id }, ctx) => {
        const user = await ctx.prisma.user.update({
          where: { id: id },
          data: {
            banned,
          },
        })
        return {
          user,
        }
      },
    })

    t.field('updateTitle', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        title: stringArg({ nullable: false }),
      },
      resolve: async (parent, { title, id }, ctx) => {
        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            title,
          },
        })
        return { server }
      },
    })

    t.field('addTag', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        tags: stringArg({ list: true, nullable: false }),
      },
      resolve: async (parent, { id, tags }, ctx) => {
        const tagObjects = await getTagsQuery(ctx, tags)

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            tags: tagObjects,
          },
        })
        return { server }
      },
    })

    t.field('removeTag', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        tag: stringArg({ nullable: false }),
      },
      resolve: async (parent, { id, tag }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) throw new Error('Could not authenticate user.')

        // const tagObjects = await getTagsQuery(ctx, tags)

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            tags: { disconnect: [{ tagName: tag }] },
          },
        })
        return { server }
      },
    })

    t.field('updateCover', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        cover: stringArg({ nullable: false }),
      },
      resolve: async (parent, { id, cover }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) throw new Error('Could not authenticate user.')

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            cover,
          },
        })
        return { server }
      },
    })

    t.field('updateIp', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        ip: stringArg({ nullable: false }),
      },
      resolve: async (parent, { id, ip }, ctx) => {
        let serverInfo
        // Fetch server info
        try {
          serverInfo = await getServerInfo(ip)
        } catch (error) {
          return error
        }

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            ip,
          },
        })
        return { server }
      },
    })

    t.field('updateRemoteInfo', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        ip: stringArg({ nullable: false }),
      },
      resolve: async (parent, { id, ip }, ctx) => {
        let serverInfo
        // Fetch server info
        try {
          serverInfo = await getServerInfo(ip)
        } catch (error) {
          return error
        }

        // return create or connect version
        const versionQuery = await getVersionQuery(ctx, serverInfo.version)
        console.log('versionQuery', versionQuery)

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            version: versionQuery,
            slots: serverInfo.players.max,
          },
        })
        return { server }
      },
    })

    t.field('createServer', {
      type: 'ServerPayload',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
        cover: stringArg(),
        tags: stringArg({ list: true, nullable: false }),
        ip: stringArg({ nullable: false }),
      },
      resolve: async (parent, { title, content, cover, tags, ip }, ctx) => {
        const userId = getUserId(ctx)
        // const tagObjects = tags.map((tag) => {
        //   return getTagsQuery(ctx, tag).then((res) => res)
        // })

        const tagObjects = await getTagsQuery(ctx, tags)
        console.log('tags', tagObjects)

        if (!userId) throw new Error('Could not authenticate user.')

        // Fetch server info
        let serverInfo = await getServerInfo(ip)
        if (!serverInfo.online) throw new Error('Could not find server info.')

        // return create or connect version
        const versionQuery = await getVersionQuery(ctx, serverInfo.version)
        console.log('versionQuery', versionQuery)
        const server = await ctx.prisma.server.create({
          data: {
            title,
            content,
            cover,
            ip: ip,
            version: versionQuery,
            slots: serverInfo.players.max,
            tags: tagObjects,
            published: true,
            author: { connect: { id: Number(userId) } },
          },
        })
        return { server }
      },
    })

    t.field('deleteServer', {
      type: 'ServerPayload',
      args: { id: intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        const server = ctx.prisma.server.update({
          where: {
            id,
          },
          data: {
            published: true,
          },
        })
        return { server }
      },
    })

    t.field('publishServer', {
      type: 'ServerPayload',
      args: { id: intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        const server = ctx.prisma.server.update({
          where: {
            id,
          },
          data: {
            published: true,
          },
        })
        return { server }
      },
    })
  },
})

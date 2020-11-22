import {
  intArg,
  mutationType,
  stringArg,
  booleanArg,
  FieldResolver,
} from '@nexus/schema'
import { string, object, array } from 'yup'
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
let cookie = require('cookie')

const validationSchema = {
  title: object().shape({
    title: string()
      .min(10, 'Title must be at least 10 characters long.')
      .max(280, 'Title must be less than 280 characters long.'),
  }),
  tags: object().shape({
    tags: array().min(1, 'You need to specify at least one tag to add.'),
  }),
  removeTag: object().shape({
    tags: array().min(1, 'You need to specify at least one tag to remove.'),
  }),
  cover: object().shape({
    cover: string()
      .url('Cover needs to be an url.')
      .matches(/[/.](gif|jpg|jpeg|tiff|png)$/, 'Cover needs to be an image.'),
  }),
  content: object().shape({
    content: string()
      .min(280, 'Content must be at least 280 characters long.')
      .max(10000, 'Content must be less than 10000 characters long.'),
  }),
}

export const Mutation = mutationType({
  definition(t) {
    t.field('testResponse', {
      type: 'String',
      args: {},
      resolve: async (_parent, {}, { res, req }) => {
        console.log(cookie.parse(req.header('Cookie')))

        const securedToken = 'a string'

        var expiration = new Date()
        expiration.setDate(expiration.getDate() + 7)

        res.cookie('rememberme', '1', {
          expires: new Date(Date.now() + 900000 * 4 * 24 * 7),
          httpOnly: true,
        })

        return securedToken
      },
    })

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

        const securedToken = sign(
          { userId: user.id, role: user.role },
          APP_SECRET,
          {
            expiresIn: '7d',
          },
        )

        ctx.res.cookie('token', securedToken, {
          expires: new Date(Date.now() + 900000 * 4 * 24 * 7),
          httpOnly: true,
        })

        return {
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
      resolve: async (parent, { title, id }, ctx): Promise<any> => {
        try {
          await validationSchema.title.validate({ title })
        } catch (e) {
          return new Error(e.errors[0])
        }

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            title,
          },
        })
        return { server }
      },
    })

    t.field('updateContent', {
      type: 'ServerPayload',
      args: {
        id: intArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: async (parent, { content, id }, ctx): Promise<any> => {
        try {
          await validationSchema.content.validate({ content })
        } catch (e) {
          return new Error(e.errors[0])
        }

        const server = await ctx.prisma.server.update({
          where: { id: id },
          data: {
            content,
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
      resolve: async (parent, { id, tags }, ctx): Promise<any> => {
        try {
          await validationSchema.tags.validate({ tags })
        } catch (e) {
          return new Error(e.errors[0])
        }

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
      resolve: async (parent, { id, tag }, ctx): Promise<any> => {
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
      resolve: async (parent, { id, cover }, ctx): Promise<any> => {
        try {
          await validationSchema.cover.validate({ cover })
        } catch (e) {
          return new Error(e.errors[0])
        }

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
      resolve: async (
        parent,
        { title, content, cover, tags, ip },
        ctx,
      ): Promise<any> => {
        const userId = getUserId(ctx)

        try {
          await validationSchema.title.validate({ title })
          await validationSchema.content.validate({ content })
          await validationSchema.cover.validate({ cover })
          await validationSchema.tags.validate({ tags })
        } catch (e) {
          return new Error(e.errors[0])
        }

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

    t.field('vote', {
      type: 'Server',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)

        const vote = ctx.prisma.vote.create({
          data: {
            author: { connect: { id: Number(userId) } },
            server: { connect: { id: Number(id) } },
          },
        })

        vote.then((res) => console.log(res)).catch((err) => console.log(err))

        return ctx.prisma.server.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })
  },
})

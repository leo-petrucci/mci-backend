import { rule, shield, and, or } from 'graphql-shield'
import { getUserId, getUserRole } from '../utils'

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    })
    return Boolean(userId) && user.role !== 'banned'
  }),
  isPostOwner: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const author = await context.prisma.post
      .findOne({
        where: {
          id: Number(id),
        },
      })
      .author()
    return userId === author.id
  }),
  isServerOwner: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const author = await context.prisma.server
      .findOne({
        where: {
          id: Number(id),
        },
      })
      .author()
    return userId === author.id
  }),
  isMod: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    })
    console.log('found user', user.role)
    return user.role === 'admin' || user.role === 'mod'
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    filterPosts: rules.isAuthenticatedUser,
    post: rules.isAuthenticatedUser,
  },
  Mutation: {
    createServer: rules.isAuthenticatedUser,
    updateTitle: and(rules.isServerOwner, or(rules.isMod)),
    addTag: and(rules.isServerOwner, or(rules.isMod)),
    removeTag: and(rules.isServerOwner, or(rules.isMod)),
    updateCover: and(rules.isServerOwner, or(rules.isMod)),
    updateIp: and(rules.isServerOwner, or(rules.isMod)),
    updateRemoteInfo: and(rules.isServerOwner, or(rules.isMod)),
    deleteServer: and(rules.isServerOwner, or(rules.isMod)),
    publish: and(rules.isServerOwner, or(rules.isMod)),
  },
})

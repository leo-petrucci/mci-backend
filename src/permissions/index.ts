import { rule, shield, and, or, not } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    })
    return Boolean(userId) && !user.banned
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
    console.log('is server owner', userId === author.id)
    return userId === author.id
  }),
  fromMod: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    })
    console.log('is mod or admin', user.role === 'admin' || user.role === 'mod')
    return user.role === 'admin' || user.role === 'mod'
  }),
  fromAdmin: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    })
    // console.log('is admin', user.role === 'admin')
    return user.role === 'admin'
  }),
  isMod: rule()(async (parent, { id }, context) => {
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(id),
      },
    })
    console.log('is mod or admin', user.role === 'admin' || user.role === 'mod')
    return user.role === 'admin' || user.role === 'mod'
  }),
  isAdmin: rule()(async (parent, { id }, context) => {
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(id),
      },
    })
    // console.log('is admin', user.role === 'admin')
    return user.role === 'admin'
  }),
}

// Being admin or mod takes precedence over being banned or not
export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    users: rules.fromMod,
  },
  Mutation: {
    // User Permissions
    updateRole: rules.fromAdmin,
    updateBan: and(rules.fromMod, not(rules.isMod), not(rules.isAdmin)),
    // Servers Permissions
    createServer: rules.isAuthenticatedUser,
    updateTitle: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    addTag: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    removeTag: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateCover: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateIp: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateRemoteInfo: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    deleteServer: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    vote: rules.isAuthenticatedUser,
    resetVotes: rules.fromAdmin,
  },
})

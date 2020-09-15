import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context)
    return Boolean(userId)
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
  isServersMod: rule()(async (parent, { id }, context) => {
    // const userId = getUserId(context)
    // hit mci endpoint https://www.minecraftitalia.net/oauth/token/ for token (unless I make it unlimited, which I might)
    // then use token to hit https://minecraftitalia.net/api/core/members/${userId}
    // if profile.secondaryGroups contains object with id: 24 [for serverlist mods]
    // return true
    return true
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
    updateTitle: rules.isServerOwner,
    addTag: rules.isServerOwner,
    removeTag: rules.isServerOwner,
    updateCover: rules.isServerOwner,
    updateIp: rules.isServerOwner,
    updateRemoteInfo: rules.isServerOwner,
    deleteServer: rules.isServerOwner,
    publish: rules.isPostOwner,
  },
})

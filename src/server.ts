import { GraphQLServer } from 'graphql-yoga'
import { permissions } from './permissions'
import { schema } from './schema'
import { createContext } from './context'
require('dotenv').config()

const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      /\.vercel\.app$/,
      'https://servers.minecraftitalia.net',
    ], // your frontend url.
  },
}

export const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
}).start(opts, () =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
  ),
)

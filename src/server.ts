import {  GraphQLServerLambda } from 'graphql-yoga'
import { permissions } from './permissions'
import { schema } from './schema'
import { createContext } from './context'
require('dotenv').config()

// new GraphQLServer({
//   schema,
//   context: createContext,
//   middlewares: [permissions],
// }).start(() =>
//   console.log(
//     `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
//   ),
// )

const lambda = new GraphQLServerLambda({
  schema,
  context: createContext,
  middlewares: [permissions],
})

exports.handler = lambda.handler
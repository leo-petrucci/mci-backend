import { PrismaClient } from '@prisma/client'
import { ContextParameters } from 'graphql-yoga/dist/types'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient,
  response: any,
  request: any
}

export function createContext(request: ContextParameters, response: ContextParameters) {
  return {
    ...request,
    ...response,
    prisma,
  }
}

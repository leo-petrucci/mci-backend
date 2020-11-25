import { PrismaClient } from '@prisma/client'
import { ContextParameters } from 'graphql-yoga/dist/types'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient,
  res: any,
  req: any
}

export function createContext({ request, response, ...rest }: ContextParameters) {
  return {
    req: request, 
    res: response,
    prisma,
  }
}

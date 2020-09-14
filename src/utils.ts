import { verify } from 'jsonwebtoken'
import { Context } from './context'
import axios, { AxiosResponse } from 'axios'

export const APP_SECRET = 'appsecret321'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && verifiedToken.userId
  }
}

interface ServerData {}

export async function getServerInfo(
  Ip: String,
): Promise<{ online: boolean; version: string; players: { max: number } }> {
  try {
    const { data } = await axios.get(`https://api.mcsrvstat.us/2/${Ip}`)
    return data
  } catch (error) {
    return error
  }
}

export async function getVersionQuery(context: Context, versionName: string) {
  console.log('checking if ', versionName, 'exists')
  const foundVersion = await context.prisma.version.findOne({
    where: {
      versionName: String(versionName),
    },
    select: {
      id: true,
    },
  })
  return foundVersion
    ? { connect: { id: foundVersion.id } }
    : { create: { versionName } }
}

export async function getTagsQuery(
  context: Context,
  tags: String[],
): Promise<{
  create: any[]
  connect: any[]
}> {
  const foundTags = tags.map(async (tag) => {
    console.log('Checking tag', tag)
    const foundTag = await context.prisma.tag.findOne({
      where: {
        tagName: String(tag),
      },
      select: {
        id: true,
      },
    })
    return { tag, foundTag }
  })

  const data = await Promise.all(foundTags).then((values) => {
    let create: object[] = []
    let connect: object[] = []
    values.map((value) => {
      // console.log('checking value', value)
      if (value.foundTag) {
        console.log('found existing tag', value.foundTag)
        connect.push({ id: value.foundTag.id })
      } else {
        console.log('Did not find tag, creating', value.tag)
        create.push({ tagName: value.tag })
      }
      return { create, connect }
    })

    return { create, connect }
  })
  return data
}

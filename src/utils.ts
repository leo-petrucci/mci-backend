import { verify } from 'jsonwebtoken'
import { Context } from './context'
import axios, { AxiosResponse } from 'axios'
const qs = require('querystring')

export const APP_SECRET = 'appsecret321'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  console.log('Is user authenticated?')
  const Authorization = context.request.get('Authorization')
  console.log('token', Authorization)
  if (Authorization) {
    console.log('Token exists')
    const token = Authorization.replace('Bearer ', '')
    try {
      const verifiedToken = verify(token, APP_SECRET) as Token
      return verifiedToken && verifiedToken.userId
    } catch (error) {
      throw new Error('Could not authenticate user.')
    }
  }
}

interface ServerData {}

export async function getServerInfo(
  Ip: String,
): Promise<{ online: boolean; version: string; players: { max: number } }> {
  const { data } = await axios.get(`https://api.mcsrvstat.us/2/${Ip}`)
  if (!data.online) throw new Error('Could not fetch server.')
  return data
}

export async function getMciToken(
  code: String,
): Promise<{
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}> {
  console.log('fetching token')
  const { data } = await axios.post(
    `https://www.minecraftitalia.net/oauth/token/`,
    qs.stringify({
      client_id: process.env.USER_CLIENT_ID,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      client_secret: process.env.USER_CLIENT_SECRET,
      scope: 'profile',
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
  return data
}

export async function getMciUserId(
  access_token: String,
): Promise<{
  id: number
  name: string
  primaryGroup: { id: number }
  photoUrl: string
}> {
  const { data } = await axios.get(
    `https://www.minecraftitalia.net/api/core/me/`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  )
  return data
}

export async function getUserProfile(code: string): Promise<any> {
  return await getMciToken(code)
    .then(
      async (res) =>
        await getMciUserId(res.access_token)
          .then((res) => res)
          .catch((error) => {
            console.log(error.response.data)
            return new Error(
              `There was a problem fetching your profile. ${error.response.data.errorCode} - ${error.response.data.errorMessage}`,
            )
          }),
    )
    .catch((error) => {
      console.log(error.response)
      return new Error(
        `There was a problem fetching your token. ${error.response.data.error} - ${error.response.data.error_description}`,
      )
    })
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

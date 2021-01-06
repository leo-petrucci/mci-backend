export {}
const chai = require('chai')
const chaiHttp = require('chai-http')
import { GraphQLServer } from 'graphql-yoga'
const { server } = require('../server')
const gql = require('graphql-tag')

let app: GraphQLServer

const { expect } = chai
chai.use(chaiHttp)

before(async () => {
  app = await server
})

describe('Server mutations', () => {
  it('users can post servers', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `
          mutation {
              createServer(title: "test server 4", content: "A description of the server that contains at least 200 characters, I do realise that is quite a lot but we might as well ask for a decent description rather than leaving it being shit. This is still not enough which is honestly quite surprising as I really did think it was going to be 200 characters", cover: "https://via.placeholder.com/350x150.jpg", tags: ["test", "test2"], ip: "eu.mineplex.com") {
                  title
              }
          }
          `,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.createServer.title).to.exist
  })
  it("banned users can't post servers", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.BANNED_TOKEN)
      .send({
        query: `
          mutation {
              createServer(title: "test server 4", content: "A description of the server that contains at least 200 characters, I do realise that is quite a lot but we might as well ask for a decent description rather than leaving it being shit. This is still not enough which is honestly quite surprising as I really did think it was going to be 200 characters", cover: "https://via.placeholder.com/350x150.jpg", tags: ["test", "test2"], ip: "eu.mineplex.com") {
                  title
              }
          }
          `,
      })
    expect(res).to.have.status(401)
  })
})

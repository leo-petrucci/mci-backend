export {}
const chai = require('chai')
const chaiHttp = require('chai-http')
import { GraphQLServer } from 'graphql-yoga'
const { server } = require('../server.ts')
const gql = require('graphql-tag')

let app: GraphQLServer

const { expect } = chai
chai.use(chaiHttp)

before(async () => {
  app = await server
})

describe('Server Endpoints', () => {
  it("Server title can't be nulled", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Authorization', process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: null) { server { title } } }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Expected type String!, found null.',
    )
  })
  it("Server title can't be short", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Authorization', process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: "test") { server { title } } }`,
      })
    expect(res.body.errors).to.be.an('array')
  })
})

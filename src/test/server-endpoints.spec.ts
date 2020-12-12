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

describe('Server Endpoints', () => {
  it("Server title can't be nulled", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: null) { server { title } } }`,
      })
    expect(res).to.have.status(400)
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
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: "test") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be at least 10 characters long.',
    )
  })
  it("Server title can't be too long", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: "${new Array(281 + 1).join(
          'a',
        )}") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be less than 280 characters long.',
    )
  })
  it("Adding tags can't be length 0", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, tags: []) { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify at least one tag to add.',
    )
  })
  it("Removing tags can't be null", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, tags: null) { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify one tag to remove.',
    )
  })
  it('Cover needs to be a url', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, cover: "test") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Cover needs to be an url.',
    )
  })
  it('Cover needs to be a url', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, cover: "http://test") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Cover needs to be an image.',
    )
  })
  it('Content needs to be at least 280 characters long', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateContent(id: 1, content: "test") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Content must be at least 280 characters long.',
    )
  })
  it('Content needs to be less than 10000 characters long', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateContent(id: 1, content: "${new Array(
          10001 + 1,
        ).join('a')}") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Content must be less than 10000 characters long.',
    )
  })
  it("Can't create server with short title", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "test") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be at least 10 characters long.',
    )
  })
  it("Can't create server with long title", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "${new Array(281 + 1).join(
          'a',
        )}") { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be less than 280 characters long.',
    )
  })
  it("Can't create server with no tags", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "${new Array(20 + 1).join(
          'a',
        )}", tags: []) { server { title } } }`,
      })
    expect(res).to.have.status(400)
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify at least one tag to add.',
    )
  })

  // SERVER AUTHORS

  it('non logged in users can view server authors', async () => {
    const res = await chai.request(app).post('/').send({
      query: `query{ server(id: 1) { title, author { username } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.server.author.username).to.be.a('string', 'Guru')
  })

  it('logged in users can view server authors', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query{ server(id: 1) { title, author { username } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.server.author.username).to.be.a('string', 'Guru')
  })

  it('non logged in users can view server authors from feed', async () => {
    const res = await chai.request(app).post('/').send({
      query: `query{ feed { title, author { username } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].author.username).to.be.a('string', 'Guru')
  })

  it('logged in users can view server authors from feed', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query{ feed { title, author { username } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].author.username).to.be.a('string', 'Guru')
  })

  // SERVER TAGS

  it('non logged in users can view server tags', async () => {
    const res = await chai.request(app).post('/').send({
      query: `query{ server(id: 1) { title, tags { tagName } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.server.tags[0].tagName).to.be.a('string', 'test')
  })

  it('logged in users can view server tags', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query{ server(id: 1) { title, tags { tagName } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.server.tags[0].tagName).to.be.a('string', 'test')
  })

  it('non logged in users can view server authors from feed', async () => {
    const res = await chai.request(app).post('/').send({
      query: `query{ feed { title, tags { tagName } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].tags[0].tagName).to.be.a('string', 'test')
  })

  it('logged in users can view server authors from feed', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query{ feed { title, tags { tagName } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].tags[0].tagName).to.be.a('string', 'Guru')
  })

  // VOTE TESTS

  it("non logged in users can't vote", async () => {
    const res = await chai.request(app).post('/').send({
      query: `mutation{ vote(id: 1) { outcome } }`,
    })
    expect(res).to.have.status(401)
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it('non-logged in users view server with canVote false', async () => {
    const res = await chai.request(app).post('/').send({
      query: `query { server (id: 1) { canVote } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.server.canVote).to.be.false
  })
  it('logged in users can view server with canVote key', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query { server (id: 1) { canVote } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.server.canVote).to.be.true
  })
  it('logged in users can vote', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation{ vote(id: 1) { outcome } }`,
      })
    expect(res).to.have.status(200)
  })
  it('canvote is false after voting', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `query { server (id: 1) { canVote } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.server.canVote).to.be.false
  })
  it("logged in users can't vote twice for the same server", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation{ vote(id: 1) { outcome } }`,
      })
    expect(res).to.have.status(401)
  })
  it("logged in users can't vote twice for the same server in a short amount of time", async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation{ vote(id: 2) { outcome } }`,
      })
    const res2 = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation{ vote(id: 2) { outcome } }`,
      })
    expect(res).to.have.status(200)
    expect(res2).to.have.status(401)
  })
  it('admins can reset votes', async () => {
    const res = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation {
          resetVotes(id: 1) {
            title
          }
        }
        `,
      })
    const res2 = await chai
      .request(app)
      .post('/')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation {
            resetVotes(id: 2) {
              title
            }
          }
          `,
      })
    expect(res).to.have.status(200)
  })
})

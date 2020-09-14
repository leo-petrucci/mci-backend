import {
  createTestContext as originalCreateTestContext,
  TestContext,
} from 'nexus/testing'
export function createTestContext() {
  let ctx = {} as TestContext // 2
  beforeAll(async () => {
    Object.assign(ctx, await originalCreateTestContext()) // 3
    await ctx.app.start() // 4
  })
  afterAll(async () => {
    await ctx.app.db.client.disconnect()
    await ctx.app.stop() // 5
  })
  return ctx
}

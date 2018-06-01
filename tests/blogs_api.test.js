const supertest = require('supertest')
const { app, server } = require('../index.js')
const api = supertest(app)
const Blog = require('../models/blog')
const { blogsInDb, formatBlog, initialBlogs } = require('../utils/tests_helper.js')


beforeAll(async () => {
  await Blog.remove({})
  /*
  await initialBlogs.forEach(async (blog) => {
    let blogObj = new Blog(blog)
    await blogObj.save()
  })*/
  // ALT-esitys, kurssin mukainen:
  const blogObjs = initialBlogs.map(b => new Blog(b))
  await Promise.all(blogObjs.map(b => {b.save()}))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('new blog post can be added', async () => {
  const blogsPreviously = await blogsInDb()

  const b = {
    'title': 'fresh Post',
    'author': 'prince de Bel Air',
    'url': 'http://localhost:2222',
    'likes': 680313
  }

  await api
    .post('/api/blogs')
    .send(b)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const res = await api
    .get('/api/blogs')

  const contents = res.body.map(bl => bl.title)

  expect(res.body.length).toBe(blogsPreviously.length + 1)
  expect(contents).toContainEqual('fresh Post')

})

test('blog with no content not added', async () => {
  const blogsPreviously = await blogsInDb()

  const b = { author: 'mark dillon' }

  await api
    .post('/api/blogs')
    .send(b)
    .expect(400)

  const currentBlogs = await blogsInDb()

  expect(currentBlogs.length).toBe(blogsPreviously.length)
})

test('POST to /api/blogs with no likes set receives likes = 0', async () => {
  const blogsPreviously = await blogsInDb()

  const b = {
    'title': 'Sweet Post',
    'author': 'prince de Bel Air',
    'url': 'http://localhost:2222'
  }

  const goodRes = await api
    .post('/api/blogs')
    .send(b)
    .expect(201)

  expect(goodRes.body.likes).toBe(0)
  const currentBlogs = await blogsInDb()

  expect(currentBlogs.length).toBe(blogsPreviously.length + 1)
})

test('BAD REQUEST returned with POST call if url and title not supplied', async () => {
  const blogsPreviously = await blogsInDb()
  const incompleteBlogPost = {
    'author': 'Karmiva Burana',
    'likes': 41620879
  }

  const badRes = await api
    .post('/api/blogs')
    .send(incompleteBlogPost)
    .expect(400)

  const res = await api
    .get('/api/blogs')
    .expect(200)

  expect(res.body.length).toBe(blogsPreviously.length)

})

afterAll(() => {
  server.close()
})
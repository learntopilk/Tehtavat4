const supertest = require('supertest')
const { app, server } = require('../index.js')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeAll(async () => {
  await Blog.remove({})

  await initialBlogs.forEach(async (blog) => {
    let blogObj = new Blog(blog)
    await blogObj.save()
  })

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('new blog post can be added', async () => {

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

  expect(res.body.length).toBe(initialBlogs.length + 1)
  expect(contents).toContainEqual('fresh Post')

})

test('blog with no content not added', async () => {
  const b = { author: 'mark dillon' }

  await api
    .post('/api/blogs')
    .send(b)
    .expect(400)
})

test('POST to /api/blogs with no likes set receives likes = 0', async () => {
  const b = {
    'title': 'Sweet Post',
    'author': 'prince de Bel Air',
    'url': 'http://localhost:2222'
  }

  const res = await api
    .post('/api/blogs')
    .send(b)
    .expect(201)

  expect(res.body.likes).toBe(0)
})

test('BAD REQUEST returned with POST call if url and title not supplied', async () => {
  const incompleteBlogPost = {
    'author': 'Karmiva Burana',
    'likes': 41620879
  }

  const res = await api
    .post('/api/blogs')
    .send(incompleteBlogPost)
    .expect(400)

})

afterAll(() => {
  server.close()
})
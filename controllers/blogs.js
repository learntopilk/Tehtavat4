const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

const formatBlogPost = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user
  }
}



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 1, username: 1, _id: 1 } )

  console.log(blogs)
  response.json(blogs.map(b => formatBlogPost(b)))

})

blogsRouter.post('/', async (request, response) => {
  let user

  if (!request.body.user) {
    console.log('must add user')
    const users = await User.find({})
    user = users[Math.floor((Math.random() * users.length))]
    request.body.user = user

  } else {
    user = await User.find({ _id: request.body.user })
  }

  if (request.body.title && request.body.author && request.body.url && request.body.likes) {

    console.log('Processing FULL')
    const blog = new Blog(formatBlogPost(request.body))

    const result = await blog.save()
      .catch(err => {
        console.log(err)
        response.status(500).json({ error: 'something went wrong' })
      })
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)

  } else if (request.body.title && request.body.url) {
    let auth

    if (request.body.author) {
      auth = request.body.author
    } else {
      auth = 'unknown'
    }

    console.log('Processing HALF')
    const blog = new Blog({
      title: request.body.title,
      author: auth,
      url: request.body.url,
      likes: 0,
      user: request.body.user._id
    })

    try {
      const result = await blog.save()

      await User.findByIdAndUpdate(req.body.user._id, { blogs: blogs.concat(result._id) })

      response.status(201).json(result)
    } catch (e) {
      console.log(e)
      response.status(500).json({ error: 'something went wrong...' })
    }

  } else {
    response.status(400).json({ error: 'Bad request' })
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  console.log('deleting...')

  await Blog.remove({ _id: request.params.id })
    .catch(err => {
      console.log('err: ', err)
      return response.status(400)
    })
  response.status(200).end()
  console.log('Deleted')
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('updating...')

  const b = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedB = await Blog
    .findByIdAndUpdate({ _id: request.params.id }, b, { new: true })
    .catch(err => {
      console.log('error updating: ', err)
      return response.status(404)
    })
  response.status(200).json(updatedB)

})

module.exports = blogsRouter
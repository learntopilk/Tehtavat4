const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

const formatBlogPost = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user,
    id: blog._id
  }
}

/*
const tokenDigger = (req) => {
  const auth = req.get('authorization')
  console.log(auth)
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    return auth.substring(7)
  } else {
    return null
  }
}*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 1, username: 1, _id: 1 })

  console.log(blogs)
  response.json(blogs.map(b => formatBlogPost(b)))

})

blogsRouter.post('/', async (req, res) => {


  try {
    const token = req.body.token //tokenDigger(req)

    if (!token) {
      console.log("no token")
      return res.status(400).send({ error: 'No token found in request' })
    }
    const decoded = jwt.verify(token, process.env.SECRET)

    if (!token || !decoded.id) {
      return res.status(401).send('Invalid or missing token')
    }

    if (!req.body.title || !req.body.url) {
      console.log('title: ', req.body.title, 'url: ', req.body.url)
      return res.status(400).send('Missing a title or url')
    }

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).send('User not found!')
    }

    let author
    if (!req.body.author || req.body.author === '') {
      author = 'Unknown'
    } else {
      author = req.body.author
    }

    let likes
    if (!req.body.likes) {
      likes = 0
    } else {
      likes = req.body.likes
    }

    const blog = new Blog({
      title: req.body.title,
      author,
      url: req.body.url,
      likes,
      user: user._id
    })

    const result = await blog.save()
    //console.log(user.notes)
    if (!user.notes) {
      user.notes = []
    }
    //console.log(user.notes)

    user.notes = user.notes.concat(result._id)
    //console.log(user.notes)

    await user.save()

    res.json(formatBlogPost(result))
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went seriously wrong.' })
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  let token
  try {
    token = request.body.token
    if (!token) {
      return response.status(403).json({ error: 'No token supplied with request' })
    }
  } catch (e) {
    console.log(e)
    return response.status(500)
  }

  const decoded = jwt.verify(token, process.env.SECRET)
  if (!decoded.id) {
    return response.status(401).send('Invalid token')
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete || !blogToDelete._id) {
    return response.status(404).json({ error: 'Not found' })
  }
  console.log('check-up: ')
  console.log(blogToDelete.user)
  console.log(decoded.id)
  if (blogToDelete.user.toString() !== decoded.id.toString() || !blogToDelete.user.toString() || blogToDelete.user.toString() === '') {
    return response.status(403).send({ error: 'Incorrect user' })
  }


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
    likes: Number(request.body.likes)
  }

  const updatedB = await Blog
    .findByIdAndUpdate({ _id: request.params.id }, b, { new: true })
    .catch(err => {
      console.log('error updating: ', err)
      return response.status(404)
    })
  response.status(200).json(formatBlogPost(updatedB))

})

module.exports = blogsRouter
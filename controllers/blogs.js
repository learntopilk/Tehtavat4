const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlogPost = (req) => {
    return {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes
    }
}



blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            console.log("retrieved blogs from mongodb")
            response.json(blogs)
        })
        .catch(err => {
            console.log("error getting blog posts: ", err)
            response.status(400).json({ error: "Something went wrong" })
        })
})

blogsRouter.post('/', (request, response) => {
    console.log("request.body: ", request.body)
    if (request.body.title && request.body.author && request.body.url && request.body.likes) {

        const blog = new Blog(formatBlogPost(request))

        blog
            .save()
            .then(result => {
                console.log("Post saved")
                response.status(201).json(result)
            })
            .catch(err => {
                console.log(err)
                response.status(500).json({ error: "something went wrong" })
            })
    } else {
        response.status(400).json({error: "Bad request"})
    }

})

module.exports = blogsRouter
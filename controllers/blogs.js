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
        console.log("Processing FULL")
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
    } else if (request.body.title && request.body.url) {
        let auth

        if (request.body.author) {
            auth = request.body.author
        } else {
            auth = 'unknown'
        }

        console.log("Processing HALF")
        const blog = new Blog({
            title: request.body.title,
            author: auth,
            url: request.body.url,
            likes: 0
        })

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
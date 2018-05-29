const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
})

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.DBURL
mongoose.connect(mongoUrl)
console.log(mongoUrl)

const formatBlogPost = (req) => {
    return {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes
    }
}

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(err => {
            console.log("error getting blog posts: ", err)
            response.status(400).json({ error: "Something went wrong" })
        })
})

app.post('/api/blogs', (request, response) => {
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
        response.status(403).json({error: "Bad request"})
    }

})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
//require('dotenv').config()
const config = require('./utils/config.js')


app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)


mongoose.connect(config.mongoUrl)
    .then(console.log("DB up and connected: ", config.mongoUrl))
    .catch(err => console.log(err))

const server = http.createServer(app)
const PORT = config.port || 3003

server.on('close', () => {
    mongoose.connection.close()
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports  = {app, server}
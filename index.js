const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const tokenDigger = require('./utils/tokenDigger')
//require('dotenv').config()
const config = require('./utils/config.js')


app.use(cors())
app.use(bodyParser.json())
app.use(tokenDigger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


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
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUser = (body) => {
  return
}

usersRouter.post('/', async (req, res) => {
  try {
    console.log('creating new User..')

    const hashRounds = 10
    const pwdHash = await bcrypt.hash(req.body.password, hashRounds)

    const u = new User({
      userName: req.body.userName,
      name: req.body.name,
      passwordHash : pwdHash,
      adult: req.body.adult
    })

    const savedUser = await u.save()

    console.log("User created!")
    res.json(savedUser)

  } catch (err) {
    console.log(err)
    return res.status(500).json({error: 'Could not create user...'})
  }

})


module.exports = usersRouter
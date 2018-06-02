const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUserForExternalDisplay = (user) => {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult
  }
}

usersRouter.get('/', async (req, res) => {
  const users  = await User.find({})
  return users.map(user => formatUserForExternalDisplay(user))
})

usersRouter.post('/', async (req, res) => {
  try {
    console.log('creating new User..')

    if (req.body.password.length < 3) {
      return res.status(400).json({ error: 'Password too short' })
    }
    // Onko käyttäjänimi jo käytössä?
    const compareNames = await User.find({ username: req.body.username })
    //console.log(compareNames)
    if (compareNames.length > 0) {
      return res.status(400).json({ error: 'Username already in use' })
    }

    let adult = ''
    if (typeof req.body.adult !== undefined) {
      adult = req.body.adult
    } else {
      adult = true
    }

    const hashRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, hashRounds)

    const u = new User({
      username: req.body.username,
      name: req.body.name,
      passwordHash,
      adult
    })
    console.log('saving...')
    const savedUser = await u.save()
    console.log('User created!')
    res.json(formatUserForExternalDisplay(savedUser))

  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Could not create user...' })
  }

})


module.exports = usersRouter
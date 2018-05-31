

const dummy = (blogs) => {
  // ...
  console.log('Here be blogs (or frogs?).', blogs)
  return 1
}

const totalLikes = (blogs) => {

  let i = 0
  blogs.forEach(b => {i += b.likes})

  console.log(i)
  return i

}


module.exports = {
  dummy, totalLikes
}


const dummy = (blogs) => {
  // ...
  console.log('Here be blogs (or frogs?).', blogs)
  return 1
}

const totalLikes = (blogs) => {

  let i = 0
  blogs.forEach(b => {i += b.likes})

  return i

}

const favoriteBlog = (blogs) => {
  let mostLikedBlog = {}
  let mostLikes = 0

  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      mostLikedBlog = blog
      mostLikes = blog.likes
    }
  })

  console.log(mostLikedBlog)
  return mostLikedBlog
}


module.exports = {
  dummy, totalLikes, favoriteBlog
}
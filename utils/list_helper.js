

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

const mostBlogs = (blogs) => {

  let counts = {}
  let alreadyFound = []

  let authorsOfEachPost = blogs.map(b => b.author)
  console.log(authorsOfEachPost)

  authorsOfEachPost.forEach(a => {
    if (counts[a]) {
      counts[a]++
    } else {
      counts[a] = 1
      alreadyFound.push(a)
    }
  })

  let mostLikes = 0
  let mostLiked
  Object.keys(counts).forEach(key => {
    if (counts[key] > mostLikes) {
      mostLiked = key
    }
  })
  console.log(mostLiked)
  return mostLiked
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}
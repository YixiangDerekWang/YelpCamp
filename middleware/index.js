var middlewareObj = {}
var Campground = require('../models/campground')
var Comment = require('../models/comment')

// isLoggedIn middleware 
middlewareObj.checkCampgroundOwnership = (req, res, next) => {

  // check if user is logged in 
  if (!req.isAuthenticated()) {
    res.redirect('back')
    return
  }

  Campground.findById(req.params.id, (err, foundCampground) => {

    // error check 
    if (err) {
      res.redirect('back')
    }

    // check if user is the author
    else if (!foundCampground.author.id.equals(req.user._id)) {
      res.redirect('back')
    }

    // ownership checked
    else {
      next()
    }
  })
}

// isLoggedIn middleware 
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

middlewareObj.checkCommentOwenership = (req, res, next) => {

  // check if user is logged in 
  if (!req.isAuthenticated()) {
    res.redirect('back')
    return
  }

  Comment.findById(req.params.comment_id, (err, foundComment) => {

    // error check 
    if (err) {
      res.redirect('back')
    }

    // check if user is the author
    else if (!foundComment.author.id.equals(req.user._id)) {
      res.redirect('back')
    }

    // ownership checked
    else {
      next()
    }
  })
}

module.exports = middlewareObj
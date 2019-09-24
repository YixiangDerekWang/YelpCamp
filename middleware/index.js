var middlewareObj = {}
var Campground = require('../models/campground')
var Comment = require('../models/comment')

// isLoggedIn middleware 
middlewareObj.checkCampgroundOwnership = (req, res, next) => {

  // check if user is logged in 
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to be logged in to do that!')
    res.redirect('back')
    return
  }

  Campground.findById(req.params.id, (err, foundCampground) => {

    // error check 
    if (err) {
      req.flash('error', 'Campground error')
      res.redirect('back')
    }

    // check if user is the author
    else if (!foundCampground.author.id.equals(req.user._id)) {
      req.flash('error', "You don't have permission to do that")
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
  req.flash('error', 'You need to be logged in to do that!')
  res.redirect('/login')
}

middlewareObj.checkCommentOwenership = (req, res, next) => {

  // check if user is logged in 
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('back')
    return
  }

  Comment.findById(req.params.comment_id, (err, foundComment) => {

    // error check 
    if (err) {
      req.flash('error', 'Something went wrong')
      res.redirect('back')
    }

    // check if user is the author
    else if (!foundComment.author.id.equals(req.user._id)) {
      req.flash('error', "You don't have the permission to do that")
      res.redirect('back')
    }

    // ownership checked
    else {
      next()
    }
  })
}

module.exports = middlewareObj
var express = require('express')
var router = express.Router({ mergeParams: true })
var Campground = require('../models/campground')
var Comment = require('../models/comment')

// new comment
router.get(
  '/new',
  isLoggedIn,
  (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('comments/new', { campground: campground })
      }
    })
  }
)

// create comment
router.post(
  '/',
  isLoggedIn,
  (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err)
        res.redirect('/campgrounds')
      }
      else {
        Comment.create(req.body.comment, (err, comment) => {
          if (err) {
            console.log(err)
          }
          else {
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            comment.save()
            campground.comments.push(comment)
            campground.save()
            res.redirect('/campgrounds/' + req.params.id)
          }
        })
      }
    })
  }
)

// isLoggedIn middleware 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
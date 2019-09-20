var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')

// INDEX - show all campgrounds
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err)
    }
    else {
      res.render('campgrounds/index', {
        campgrounds: campgrounds
      })
    }
  })
})

// NEW - show form to create campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

// SHOW - shows info about one campground
router.get('/:id', (req, res) => {

  // find the specific campground
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('campgrounds/show', { campground: foundCampground })
      }
    })
})

// CREATE - add new campground to database
router.post('/', isLoggedIn, (req, res) => {
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var body = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: author
  }
  Campground.create(
    body,
    (err, campground) => {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect('/campgrounds')
      }
    }
  )
})

// isLoggedIn middleware 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}


module.exports = router
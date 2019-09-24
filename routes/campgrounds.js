var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
var middleware = require('../middleware')

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
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

// CREATE - add new campground to database
router.post('/', middleware.isLoggedIn, (req, res) => {
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

// EDIT - edit campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err)
    }
    res.render('./campgrounds/edit', { campground: foundCampground })
  })
})

// UPDATE - update campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds')
    }
    else {
      res.redirect('/campgrounds/' + campground.id)
    }
  })
})

// DESTROY - delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds')
    }
    else {
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router
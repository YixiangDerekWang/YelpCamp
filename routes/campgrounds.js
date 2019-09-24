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
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err)
    }
    res.render('./campgrounds/edit', { campground: foundCampground })
  })
})

// UPDATE - update campground
router.put('/:id', checkCampgroundOwnership, (req, res) => {
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
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds')
    }
    else {
      res.redirect('/campgrounds')
    }
  })
})

// isLoggedIn middleware 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkCampgroundOwnership(req, res, next) {

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

module.exports = router
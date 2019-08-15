var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Campground = require('./models/campground')
var seedDB = require('./seeds')

seedDB()

// tools set up 
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })


app.get('/', (req, res) => {
  res.render('landing')
})

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err)
    }
    else {
      res.render('index', {
        campgrounds: campgrounds
      })
    }
  })
})

// NEW - show form to create campground
app.get('/campgrounds/new', (req, res) => {
  res.render('new')
})

// SHOW - shows info about one campground
app.get('/campgrounds/:id', (req, res) => {

  // find the specific campground
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('show', { campground: foundCampground })
      }
    })
})

// CREATE - add new campground to database
app.post('/campgrounds', (req, res) => {
  var body = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
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

// new comment


app.listen(3000, () => {
  console.log('Yelp Camp has started!')
})
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// tools set up 
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })

// schema set up 
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})
var Campground = mongoose.model('Campground', campgroundSchema)

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful Granite"
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err)
//     }
//     else {
//       console.log('new campground created')
//       console.log(campground)
//     }
//   }
// )


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
  Campground.findById(req.params.id, (err, foundCampground) => {
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

app.listen(3000, () => {
  console.log('Yelp Camp has started!')
})
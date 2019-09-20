var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Campground = require('./models/campground')
var Comment = require('./models/comment')
var seedDB = require('./seeds')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var User = require('./models/user')

seedDB()

// passport configuration
app.use(require('express-session')({
  secret: 'huge secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// tools set up 
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

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
      res.render('campgrounds/index', {
        campgrounds: campgrounds
      })
    }
  })
})

// NEW - show form to create campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
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
        res.render('campgrounds/show', { campground: foundCampground })
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
app.get(
  '/campgrounds/:id/comments/new',
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

app.post(
  '/campgrounds/:id/comments',
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
            campground.comments.push(comment)
            campground.save()
            res.redirect('/campgrounds/' + req.params.id)
          }
        })
      }
    })
  }
)

// ============
// Auth Routes
// ============

// show registrition form 
app.get('/register', (req, res) => {
  res.render('register')
})

// handel sign up logic 
app.post('/register', (req, res) => {
  var newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('register')
    }

    // log in the user after registered 
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds')
    })
  })
})

// show login form 
app.get('/login', (req, res) => {
  res.render('login')
})

// handel login logic
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.send('login logic happens here')
  }
)

// logout route
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/campgrounds')
})

// isLoggedIn middleware 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(3000, () => {
  console.log('Yelp Camp has started!')
})
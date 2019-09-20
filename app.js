var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var seedDB = require('./seeds')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var User = require('./models/user')

var commentRoutes = require('./routes/comments')
var campgroundRoutes = require('./routes/campgrounds')
var indexRoutes = require('./routes/index')

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

app.use('/campgrounds', campgroundRoutes)
app.use('/', indexRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(3000, () => {
  console.log('Yelp Camp has started!')
})
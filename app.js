var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var methodOverride = require('method-override')
var User = require('./models/user')

var commentRoutes = require('./routes/comments')
var campgroundRoutes = require('./routes/campgrounds')
var indexRoutes = require('./routes/index')
var flash = require('connect-flash')

var seedDB = require('./seeds')
//seedDB()      // seed the database

// passport configuration
app.use(methodOverride('_method'))
app.use(require('express-session')({
  secret: 'huge secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// tools set up 
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

/*
 * Local Database: mongodb://localhost/yelp_camp
 * Mongo Lab:      mongodb+srv://Derek:wodemimashi608@yelpcamp-cbskv.mongodb.net/YelpCamp?retryWrites=true&w=majority
 */
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true })
  .then(() => console.log('Database Connected'))
  .catch(err => console.log('Database connection error: ' + err.message))
mongoose.set('useFindAndModify', false)
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/', indexRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

const port = process.env.PORT || 3000
const ip = process.env.IP || "127.0.0.1"
app.listen(port, () => {
  console.log('Server has started at port ' + port + ' ip: ' + ip)
})
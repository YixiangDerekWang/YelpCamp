var express = require('express')
var router = express.Router({ mergeParams: true })
var passport = require('passport')
var User = require('../models/user')

// root route
router.get('/', (req, res) => {
  res.render('landing')
})

// registrition form 
router.get('/register', (req, res) => {
  res.render('register')
})

// sign up logic 
router.post('/register', (req, res) => {
  var newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message)
      console.log(err)
      return res.redirect('register')
    }

    // log in the user after registered 
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to Yelp Camp ' + user.username)
      res.redirect('/campgrounds')
    })
  })
})

// login form 
router.get('/login', (req, res) => {
  res.render('login')
})

// login logic
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.send('login logic happens here')
  }
)

// logout route
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Successfully logged out')
  res.redirect('/campgrounds')
})

module.exports = router
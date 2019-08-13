var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var campsPlaceholder = [
  {
    name: "Salmon Creek",
    image: "https://cdn.shopify.com/s/files/1/2468/4011/products/campsite_1_600x.png?v=1524622915"
  },
  {
    name: "Granite Hill",
    image: "https://www.pitchup.com/images/4/image/private/s--GoBW6-qo--/c_limit,h_2400,w_3200/e_improve,fl_progressive/q_auto/b_rgb:000,g_south_west,l_pitchup.com_wordmark_white_watermark,o_15/v1423732353/torrent-walk-campsite/torrent-walk-campsite-camping-near-cadair-idris.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://www.nps.gov/subjects/camping/images/site-number_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"
  }
]

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('landing')
})

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {
    campgrounds: campsPlaceholder
  })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('new')
})

app.post('/campgrounds', (req, res) => {

  // get data from form and add to camp ground array
  var body = {
    name: req.body.name,
    image: req.body.image
  }
  campsPlaceholder.push(body)

  // redirect to campground page
  res.redirect('/campgrounds')
})

app.listen(3000, () => {
  console.log('Yelp Camp has started!')
})
var Campground = require('./models/campground')
var Comment = require('./models/comment')
var data = [
  {
    name: "Cloud's Rest",
    image: "https://i1.wp.com/visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg?resize=640%2C420",
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis saepe, sed aspernatur minus, facilis quas sunt iste quisquam debitis, minima eos quod architecto praesentium quos iusto ab rerum accusamus ullam!'
  },
  {
    name: "Brendel Lake Campgound",
    image: "https://res.cloudinary.com/miles-extranet-dev/image/upload/ar_16:9,c_fill,w_1000,g_face,q_50/Michigan/account_photos/3321/273758c7f87bb3b3ccadde7f5b4123f9_brendellakecampground.jpg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis saepe, sed aspernatur minus, facilis quas sunt iste quisquam debitis, minima eos quod architecto praesentium quos iusto ab rerum accusamus ullam!"
  },
  {
    name: "Mountain Black",
    image: "https://11mjsg94ex5ggb0b7k6013aj-wpengine.netdna-ssl.com/wp-content/uploads/img_0842-1170x640.jpg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis saepe, sed aspernatur minus, facilis quas sunt iste quisquam debitis, minima eos quod architecto praesentium quos iusto ab rerum accusamus ullam!"
  },
]

function seedDB() {

  // remove all campgrounds
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log('Removed campgrounds')

      // add in new campgrounds
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err)
          }
          else {
            console.log('Created a campground')

            // add in comments
            Comment.create(
              {
                text: "This place is beautiful, but I hope it has Wifi",
                author: "Homer"
              }, (err, comment) => {
                if (err) {
                  console.log(err)
                }
                else {
                  campground.comments.push(comment)
                  campground.save()
                  console.log('Created a new comment')
                }
              })
          }
        })
      })
    }
  })

  // add in comments
}

module.exports = seedDB

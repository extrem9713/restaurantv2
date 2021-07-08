const restaurantdata = require('./restaurant.json')
const Restaurant = require('../restaurant')
const restaurantList = restaurantdata.results

const mongoose = require('mongoose')
const db = mongoose.connection

mongoose.connect('mongodb://localhost/restaurant', {useNewUrlParser: true, useUnifiedTopology: true})

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
  restaurantList.forEach((restaurant) =>
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })    
  )
  console.log('data add success')
})

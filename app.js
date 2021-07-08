const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const db = mongoose.connection

mongoose.connect('mongodb://localhost/restaurant', {useNewUrlParser: true, useUnifiedTopology: true})

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({defaultlayout:'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

//index route
app.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', {restaurants}))
  .catch(error => console.error(error))
})

//search route
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      if (keyword) {
        restaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
        )        
        return res.render('index', {restaurants, keyword})        
      }
      if (restaurants.length === 0) {
        const error = `<h3>找不到您的關鍵字!</h3>`
        return res.render('index', {error})
      }          
    })
    .catch((error) => console.error(error))
})

//create route
app.get('/restaurants/new', (req, res) =>{
  return res.render('new')
})
app.post('/restaurants', (req, res) => {
  const{name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  return Restaurant.create({name, name_en, category, image, location, phone, google_map, rating, description})
  .then(() => res.redirect('/'))
  .catch(error => console.error(error))  
})

//detail route
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant) => res.render('detail', {restaurant}))
  .catch(error => console.error(error))
})

// edit route
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant) => res.render('edit', {restaurant}))
  .catch(error => console.error(error))
})

app.post('/restaurants/:id/edit',(req, res) => {
  const id = req.params.id
  const newrestaurant = req.body
  return Restaurant.findById(id)
  .then((restaurant) => {
    restaurant.name = newrestaurant.name
    restaurant.name_en = newrestaurant.name_en
    restaurant.category = newrestaurant.category
    restaurant.image = newrestaurant.image
    restaurant.location = newrestaurant.location
    restaurant.phone = newrestaurant.phone
    restaurant.google_map = newrestaurant.google_map
    restaurant.rating = newrestaurant.rating
    restaurant.description = newrestaurant.description
    return restaurant.save()
  })
  .then(() => res.redirect(`/restaurants/${id}`))
  .catch(error => console.error(error))
})

//delete route
app.post('/restaurants/:id/delete', (req, res) =>{
  const id = req.params.id
  return Restaurant.findById(id)
  .then(restaurant => restaurant.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`this is running express http://localhost:${port}`)
})


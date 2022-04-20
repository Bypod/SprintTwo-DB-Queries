const express = require('express')
const app = express()
const dal = require('./usage/db')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true})); // req.body (for forms)
app.use(express.json()) // => req.body (for fetch)
app.use(express.static('public'))

//ROUTES//

//display cars
const carsRouter = require('./routes/all_cars')
app.use('/', carsRouter)

//Server Running
app.listen(3000, () => {
    console.log("server is running on port 3000")
})

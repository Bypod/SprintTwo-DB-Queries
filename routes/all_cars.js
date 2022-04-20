const express = require('express')
const router = express.Router();

//sql connections
const carsDal = require('../usage/cars.dal')

//mongo connections
const {MongoClient} = require('mongodb')
const mongoDal = require('../usage/crud')
const uri = "mongodb+srv://john:ranger16@cluster0.ilmyj.mongodb.net/sprintdb?retryWrites=true&w=majority"
const client = new MongoClient(uri) 
const {carsByName, allCars} = require('../usage/crud')
const {logEvents} = require('../usage/logger')

// const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://john:ranger16@cluster0.ilmyj.mongodb.net/sprintdb?retryWrites=true&w=majority')

router.get('/', async (req, res) => {
    // let name = 'Toyota'
    // res.render('cars', {car_make: name})
    let cars = await carsDal.getAllCars()
    let carResults = await allCars(client)
    res.render('cars', {cars, carResults})
    logEvents('router.get()', 'INFO', 'Database Query Webpage Initiated.')
})

router.post('/', async (req, res) => {
    let dbChoice = req.body.databases
    let filterChoice = req.body.filters
    if(dbChoice == '0'){
        let cars = [{car_year: 'Must Select Database!!!'}]
        let carResults = []
        res.render('cars', {cars, carResults})
        logEvents('router.post()', 'WARN', 'Database was not selected and Nothing was inputed.')
    } else if(dbChoice == '1'){
        let cars =await carsDal.getFilteredCars(req.body.carput, req.body.filters)
        logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: SQL Filter: ${filterChoice}`)
        let carResults = []
        res.render('cars', {cars, carResults})
    } else if(dbChoice == '2'){
        if(filterChoice == 'select'){
            let cars = []
            let carResults = await allCars(client)
            res.render('cars', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: No Input DB: MongoDB Filter: ${filterChoice}`)
        } else {
            let cars = []
            let carResults = await carsByName(client, req.body.carput, req.body.filters)
            res.render('cars', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB Filter: ${filterChoice}`)
        }
    } else if(dbChoice == '3'){
        if(req.body.filters == 'select'){
            let cars =await carsDal.getAllCars()
            let carResults = await allCars(client)
            res.render('cars', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB and SQL Filter: ${filterChoice}`)
        } else{
            console.log(req.body.filters)
            let cars =await carsDal.getFilteredCars(req.body.carput, req.body.filters)
            let carResults = await carsByName(client, req.body.carput, req.body.filters)
            res.render('cars', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB and SQL Filter: ${filterChoice}`)
        }
    }
})


module.exports = router
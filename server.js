if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const pg = require("pg");
const PORT = 3000;
const morgan = require("morgan");


//sql connections
const carsDal = require('./usage/cars.dal')

//mongo connections
const {MongoClient} = require('mongodb')
const mongoDal = require('./usage/crud')
const uri = "mongodb+srv://john:ranger16@cluster0.ilmyj.mongodb.net/sprintdb?retryWrites=true&w=majority"
const client = new MongoClient(uri) 
const {carsByName, allCars} = require('./usage/crud')
const {logEvents} = require('./usage/logger')
let user_id = Math.floor(Math.random() * 100)


const initializePassport = require("./passport-config");
  initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static('public'))


app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(morgan("short"));

app.get("/", checkAuthenticated, async function (req, res) {
  let cars = await carsDal.getAllCars()
  let carResults = await allCars(client)
  let u_id = req.user.name
  res.render('cars.ejs', {cars, carResults, u_id})
  logEvents('router.get()', 'INFO', 'Database Query Webpage Initiated.')
  // console.log(req.user.name)
  console.log("-- /root page Served");
});

app.post('/', async (req, res) => {
  console.log(req.u_id)
  let dbChoice = req.body.databases
  let filterChoice = req.body.filters
    if(dbChoice == '0'){
        let cars = [{car_year: 'Must Select Database!!!'}]
        let carResults = []
        res.render('cars.ejs', {cars, carResults})
        logEvents('router.post()', 'WARN', 'Database was not selected and Nothing was inputed.')
    } else if(dbChoice == '1'){
        let cars =await carsDal.getFilteredCars(req.body.carput, req.body.filters)
        logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: SQL Filter: ${filterChoice}\tUser ID: ${user_id}`)
        let carResults = []
        res.render('cars.ejs', {cars, carResults})
    } else if(dbChoice == '2'){
        if(filterChoice == 'select'){
            let cars = []
            let carResults = await allCars(client)
            res.render('cars.ejs', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: No Input DB: MongoDB Filter: ${filterChoice}\tUser ID: ${user_id}`)
        } else {
            let cars = []
            let carResults = await carsByName(client, req.body.carput, req.body.filters)
            res.render('cars.ejs', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB Filter: ${filterChoice}\tUser ID: ${user_id}`)
        }
    } else if(dbChoice == '3'){
        if(req.body.filters == 'select'){
            let cars =await carsDal.getAllCars()
            let carResults = await allCars(client)
            res.render('cars.ejs', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB and SQL Filter: ${filterChoice}\tUser ID: ${user_id}`)
        } else{
            console.log(req.body.filters)
            let cars =await carsDal.getFilteredCars(req.body.carput, req.body.filters)
            let carResults = await carsByName(client, req.body.carput, req.body.filters)
            res.render('cars.ejs', {cars, carResults})
            logEvents('router.post()', 'INFO', `User Input: ${req.body.carput} DB: MongoDB and SQL Filter: ${filterChoice}\tUser ID: ${user_id}`)
        }
    }
})


app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});


app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("-- Redirecting to login : Registration Successful");
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
  console.log("-- Logged out !!!!!");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("-- Not logged in yet!");
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(PORT, () => {
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log();
  console.log(
    "\x1b[33m%s\x1b[0m",
    "-------------------------------------------"
  );
  console.log("\u001b[1;34m-------------------------------------------");
  console.log(
    "\x1b[33m%s\x1b[0m",
    "-------------------------------------------"
  );
  console.log("\u001b[1;34m-------------------------------------------");
  console.log(`\u001b[1;31m KrYpToNiTe Server Running on port: ${PORT} `);
  console.log("\u001b[1;32m HaCkErS uNiTe - H A C K -DA- P L A N E T");
  console.log(
    "\x1b[33m%s\x1b[0m",
    "-------------------------------------------"
  );
  console.log("\x1b[34m             Logging Initiated");
  console.log(
    "\x1b[33m%s\x1b[0m",
    "-------------------------------------------"
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    "-------------------------------------------"
  );
  console.log();
  console.log();
  console.log();
});

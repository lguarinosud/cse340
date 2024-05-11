/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory Card Route
//app.get("/inv/detail/:env_id", utilities.handleErrors(invController.buildByInventoryId));

// Classification Grid Route
//app.get("/inv/type/:classification_id", utilities.handleErrors(invController.buildByClassificationId));


// Inventory routes
app.use("/inv", inventoryRoute)
//app.get("/", utilities.handleErrors(invController.buildByClassificationId))
//app.get("/detail", utilities.handleErrors(invController.buildByInventoryId))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  console.error("error : " + err.status)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  const msj = await utilities.buildErrorMessage(message)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    nav,
    msj
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
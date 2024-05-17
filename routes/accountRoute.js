
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities"); // Import the utilities module
const regValidate = require('../utilities/account-validation')

//Login route 
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Registration route
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

//Register Account route
//router.post('/register', utilities.handleErrors(accountController.registerAccount))
// Process the registration data
console.log("router.post-register: ")
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
module.exports = router;

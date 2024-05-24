
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities"); // Import the utilities module
const regValidate = require('../utilities/account-validation')

//Login route 
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
  "/login",
   
    regValidate.loginRules(),
    regValidate.checkUserLogin,
     utilities.handleErrors(accountController.processLogin)
  
)

//Registration route
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Account Management vroute view

  router.get(
      "/", 
     utilities.checkLogin, 
     utilities.handleErrors(accountController.buildAccountManagement))



module.exports = router;

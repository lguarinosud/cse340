
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

  // Account Management route view
// NEVER PUT A CONSOLE.LOG() WHITHIN A ROUTER.GET(), IT'LL CRASH
  router.get(
      "/", 
     utilities.checkLogin, //This will check if the user is logged in 
     //utilities.checkEmpAdminPermissions, // Check for employee or Admin permissions
   
     utilities.handleErrors(accountController.buildAccountManagement)) 

     //Account Update route
router.get("/update/:account_id",
utilities.checkLogin,
utilities.handleErrors(accountController.buildAccountUpdateView));

// Route to Update an Account POST
router.post("/update/", 
utilities.checkLogin,
regValidate.accountUpdateRules(),
regValidate.checkAccountUpdate,
utilities.handleErrors(accountController.updateAccount));

// Route to Update the password Account POST
router.post("/update/password", 
utilities.checkLogin,
regValidate.accountPasswordUpdateRules(),
regValidate.checkPasswordUpdate,
utilities.handleErrors(accountController.updatePassword));

// Route to logout a user 
router.get("/logout", 
utilities.handleErrors(accountController.accountLogout));


module.exports = router;



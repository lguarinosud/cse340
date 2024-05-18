const utilities = require("../utilities/"); // Import the utilities module
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


//const accountCont = {}
/* ****************************************
*  Deliver login view
* *************************************** */
// accountCont.buildLogin = async function (req, res, next) {
//     let nav = await utilities.getNav()
//     let login = await utilities.buildLogin(); 
//     res.render("./account/login", {
//       title: "Login",
//       nav,
//       login
//     })
//   }

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    errors: null,
    nav,
  })
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  console.log("ProcessLogin started")
  let nav = await utilities.getNav()
  const {account_email, account_password } = req.body
  console.log("request: ", req.body)
  const userValidated = await accountModel.checkUser(
    account_email,
    account_password
  )
   console.log("user: ", userValidated)
  if (userValidated == true) {   
    req.flash(
      "notice",
      `Congratulations, you\'re log in.`
    )
    res.status(201).render("index", {
      title: "Home",
      nav,
      
       //No need to pass errors: null as the home page is not displaying errors and also this section is returing 201s
    })
  } else {
    req.flash("notice", "Username or PASSWORD incorrect, please try again.")
    res.status(501).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}


// accountCont.buildRegistration = async function (req, res, next, msj) {
//   let nav = await utilities.getNav()
//   let register = await utilities.buildRegistration();
//   if (msj)
//     {req.flash("notice", msj)}
//   res.render("./account/register", {
//     title: "Register",
//     nav,
//     register,
//   })
// }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
 
  res.render("./account/register", {
      title: "Register",
      nav,
      errors: null,
  });
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("./account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )

  if (regResult) {
    // req.flash create the message which then can be rendered using message() in the view
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      errors: null, //THis is needed otherwise the app will crash because will get an undefined n the view if we're using <% if (errors) { %>
       
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
      title: "Registration",
      nav,
      errors: null,
      
    })
  }
}


  module.exports = { buildLogin, processLogin,  buildRegistration, registerAccount }
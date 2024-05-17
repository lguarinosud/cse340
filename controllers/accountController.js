const utilities = require("../utilities/"); // Import the utilities module
const accountModel = require("../models/account-model")


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
  let flashMessage = req.flash('message'); // Assuming 'message' is the key for flash messages
  res.render("./account/login", {
    title: "Login",
    flashMessage: flashMessage.length > 0 ? flashMessage : null, // Pass flash message to the view
    errors: null,
    nav,
  })
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
  let flashMessage = req.flash('message'); // Assuming 'message' is the key for flash messages

  res.render("./account/register", {
      title: "Register",
      nav,
      flashMessage: flashMessage.length > 0 ? flashMessage : null, // Pass flash message to the view
      errors: null,
  });
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
      title: "Registration",
      nav,
    })
  }
}


  module.exports = { buildLogin, buildRegistration, registerAccount }
const utilities = require("../utilities/"); // Import the utilities module
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { request } = require("express");
require("dotenv").config()


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

// /* ****************************************
// *  Process Login
// * *************************************** */
// async function processLogin(req, res) {
//   console.log("ProcessLogin started")
//   let nav = await utilities.getNav()
//   const {account_email, account_password } = req.body
//   console.log("request: ", req.body)
//   const userValidated = await accountModel.checkUser(
//     account_email,
//     account_password
//   )
//    console.log("user: ", userValidated)
//   if (userValidated == true) {   
//     req.flash(
//       "notice",
//       `Congratulations, you\'re log in with this account ${account_email}`
//     )
//     res.status(201).render("index", {
//       title: "Home",
//       nav,
      
//        //No need to pass errors: null as the home page is not displaying errors and also this section is returing 201s
//     })
//   } else {
//     req.flash("notice", "Username or PASSWORD incorrect, please try again.")
//     res.status(501).render("./account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//     })
//   }
// }
/* ****************************************
 *  Process login request
 * ************************************ */
async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  console.log("request:", req.body)
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("accountData:", accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("./account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   req.flash("notice", "You're logged in")
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   } else {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
   
  } catch (error) {
   return new Error('Access Forbidden')
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

// 
async function buildAccountManagement(req, res, next) {
  console.log("AccountManagement controler")
  let nav = await utilities.getNav()
  res.render("./account/accountManagement", {
    title: "Account Management",
    errors: null,
    nav,
  })
}

// // Check login user status. // not in used at the moment. I'm direclty checking loggedin locals variable in the view for the header
// const checkLoginStatus = (req, res, next) => {
//   res.locals.loggedIn = req.session.loggedin === 1;
//   res.locals.account_firstname = req
//   next();
// };


// async function buildAccountUpdate(req, res, next) {
//   console.log("AccountUpdate controler")
//   let nav = await utilities.getNav()
//   res.render("./account/accountUpdate", {
//     title: "Account Update",
//     errors: null,
//     nav,
//   })
// }

  async function buildAccountUpdateView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  console.log("buildAccountUpdateView running")
  console.log("account_id:", account_id)
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  console.log("GetClientbyID: ", itemData)
  const itemName = `${itemData.account_firstname} - ${itemData.account_type}`
  res.render("./account/accountUpdate", {
    title: "Update Account " + itemName,
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
  })
}

/* ****************************************
*  Update Account
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_firstname,
    account_lastname,
    account_email,
   } = req.body

  
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    // req.flash create the message which then can be rendered using message() in the view
    console.log("updateResult:", updateResult)
    const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/account")
    
  } else {
  
    const itemName = `${account_lastname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/accountUpdate", {
    title: "Update " + itemName,
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}


/* ****************************************
*  Update Password
* *************************************** */

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.redirect(`/account/update/${account_id}`)
    }
  
  
  const regResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )

  if (regResult) {
    // req.flash create the message which then can be rendered using message() in the view
    req.flash(
      "notice",
      `Congratulations, you\'re password has been updated.`
    )
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.redirect(`/account/update/${account_id}`)
      
    }
  }

  /* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You've been logged out.");
  res.redirect("/");
}


  




module.exports = { buildLogin, 
                  processLogin,  
                  buildRegistration, 
                   registerAccount, 
                   buildAccountManagement,
                   buildAccountUpdateView,
                   updateAccount,
                   updatePassword,
                   accountLogout,
                  }

                  
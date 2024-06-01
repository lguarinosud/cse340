const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory Card  view HTML
* ************************************ */
Util.buildInventoryCard = async function(vehicle) {
  let card = '';
  if (vehicle) {
    card += '<div class="cardDetailWrapper">';
    card += '<div class="cardDetail">';
    card += '<img src="' + vehicle.inv_thumbnail + '" class="card-img-top" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">';
    card += '<div class="card-body">';
    //card += '<h2 class="card-title">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>';
    card += '<p class="card-text">' + vehicle.inv_description + '</p>';
    card += '<p class="card-text">Year: ' + vehicle.inv_year + '</p>';
    card += '<p class="card-text">Miles: ' + vehicle.inv_miles.toLocaleString() + '</p>';
    card += '<p class="card-text">Color: ' + vehicle.inv_color + '</p>';
    card += '<p class="card-text">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
    card += '<a href="javascript:history.back()" class="btn btn-primary">Go Back</a>';
    card += '</div>';
    card += '</div>';
    card += '</div>';
  } else {
    card += '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return card;
};

/* **************************************
* Build the Error message view HTML
* ************************************ */
Util.buildErrorMessage = async function(message) {
  let ErrorMessage = '';
  if (message) {
    ErrorMessage += '<div class="error-message-container">';
    ErrorMessage += '<div class="error-message">';
    //ErrorMessage += '<img src="/images/site/crash.webp" alt="Crashed app iamge" />';
    ErrorMessage += '<div class="message-container">';
    ErrorMessage += '<p class="error-text">' + message + '</p>';
    ErrorMessage += '</div>';
    ErrorMessage += '</div>';
    ErrorMessage += '</div>';
  } else {
    ErrorMessage += '<p class="notice">Ups, we had a little blip! Please return to home and start again.</p>';
  }
  return ErrorMessage;
};

/* **************************************
* Build the Account Login view view HTML
* ************************************ */
Util.buildLogin = async function() {
   let login = '';
  
    login += '<form action="/login" method="POST" class="login-form">';
    login += '<label for="email">Email:</label>';
    login += '<input type="email" id="account_email" name="email" required>';
    //login += '<p class="error-text">' + message + '</p>';
    login += '<label for="password">Password:</label>';
    login += '<input type="password" id="account_password" name="password" required>';
    login += '<button type="submit">Login</button>';
    login += '</form>';
    login += '<p>Don\'t have an account? <a href="/account/register">Register here</a></p>'
    
  return login;
};

/* **************************************
* Build the Account Registration view HTML
* ************************************ */

Util.buildRegistration = async function(msj){
  let registrationHTML = '';
  if (msj && msj !== 'undefined' && flash.length > 0){
    registrationHTML += '<%- messages() %>'
    }
  
  registrationHTML += '<form action="account/register" method="POST" class="registration-form">';
  registrationHTML += '<div>';
  registrationHTML += '<label for="account_firstname">First Name:</label>';
  registrationHTML += '<input type="text" id="account_firstname" name="account_firstname" required>';
  registrationHTML += '</div>';
  registrationHTML += '<div>';
  registrationHTML += '<label for="account_lastname">Last Name:</label>';
  registrationHTML += '<input type="text" id="account_lastname" name="account_lastname" required>';
  registrationHTML += '</div>';
  registrationHTML += '<div>';
  registrationHTML += '<label for="account_email">Email:</label>';
  registrationHTML += '<input type="email" id="account_email" name="account_email" required>';
  registrationHTML += '</div>';
  registrationHTML += '<div>';
  registrationHTML += '<label for="password">Password:</label>';
  registrationHTML += '<input type="password" id="account_password" name="account_password" required pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})">';
  registrationHTML += '<small>Password must be at least 12 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character.</small>';
  registrationHTML += '</div>';
  registrationHTML += '<button type="submit">Register</button>';
  registrationHTML += '</form>';

  return registrationHTML;
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = 0; // Default to not logged in
  res.locals.accountData = null; // Default to no account data
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }

//account.data holds the cookie data which is
    //  accountData: {
    //   account_id: 30,
    //   account_firstname: 'Manager',
    //   account_lastname: 'User',
    //   account_email: 'manager@340.edu',
    //   account_type: 'Admin',
    //   account_password: '$2a$10$pJg42fuUcnmPjIHyHpwFUOjjz48Rqrn6T9.CsWs5NdbPqmQAlz6wK'
    // }
     res.locals.accountData = accountData 
     res.locals.loggedin = 1
    // For a reason still don't understand, accountdata can be call as "accountData, but loggedin needs to be "res.locals.loggedin" otherwise app will crash
     console.log("checkJWTToken: accountData ",accountData)
     console.log("checkJWTToken: loggedin: ",res.locals.loggedin) 
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
//  Util.checkLogin = (req, res, next) => {
//   if (res.locals.loggedin) {
//     next()
//   } else {
//     req.flash("notice", "Please log in.")
//     return res.redirect("/account/login")
//   }
//  }

 /* ****************************************
 *  Check Login and Role
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  // Check if the user is logged in
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  else {
    next()
  }

  // // Check if the user has the role of "Employee" or "Admin"
  // if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
  //   console.log("Permissions OK account type:", res.locals.accountData.account_type)
  //   // User has the required role, allow them to proceed
  //   next();
  // } else {
  //   // User does not have the required role, redirect them with a flash message
  //   console.log("No permissions account type:", res.locals.accountData.account_type)
  //   req.flash("notice", "You do not have permission to access this page.");
  //   return res.redirect("/"); // Redirect to a suitable page
  // }
};

/* ****************************************
 *  Check Login and Role
 * ************************************ */
Util.checkEmpAdminPermissions = (req, res, next) => {
  // Check if the user is logged in
  if (!res.locals.loggedin) {
    req.flash("notice", " Please log in first");
    return res.redirect("/account/login");
  }

  // Check if the user has the role of "Employee" or "Admin"
  if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
    console.log("Permissions OK account type:", res.locals.accountData.account_type)
    // User has the required role, allow them to proceed
    next();
  } else {
    // User does not have the required role, redirect them with a flash message
    console.log("No permissions account type:", res.locals.accountData.account_type)
    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/account/login"); // Redirect to a suitable page
  }
};

Util.getSearchForm = (key_word = '') => {
  // Define the HTML structure for the search container dynamically
  let searchForm = `
    <div class="search-container">
      <form class="search-bar" action="/inv/search" method="get">
        <input type="search"
               name="key_word"
               placeholder="Search your car here..."
               pattern="^[A-Za-z0-9 ]{2,}$"
               title="Only letters and numbers are allowed, and you must enter more than one character."
               required
               value="${key_word}">
        <button type="submit">Search</button>
      </form>
    </div>
    <small>*Only letters and numbers are allowed, and you must enter more than one character. You can use more than a keyword separated by a space.</small>`;

    return searchForm;

  
};

module.exports = Util
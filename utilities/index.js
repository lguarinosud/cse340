const invModel = require("../models/inventory-model")
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
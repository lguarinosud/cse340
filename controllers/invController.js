const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const classificationModel = require("../models/inventory-model")

const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  console.log("req.params.inventoryId: ",req.params.inventoryId )
  const inv_id = req.params.inventoryId
  console.log("inv_log: ", inv_id)
  const vehicle = await invModel.getInventoryByInventoryId(inv_id)
  console.log("DEBUG=Vehicule: ",vehicle )
  const card = await utilities.buildInventoryCard(vehicle)
  let nav = await utilities.getNav()
  const carMake = vehicle.inv_make
  const carModel = vehicle.inv_model
  res.render("./inventory/cards", {
    title: carMake +" " + carModel,
    nav,
    card,
  })
}

/* ***************************
 *  Build Inventory Management by inventory id view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  res.render("./inventory/inv-management", {
    title: 'Inventory Management',
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by add a classification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add a new Classification',
    nav,
    errors: null,
  })
}

/* ****************************************
*  Register new Classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  
  const regResult = await classificationModel.addClassifaction(
    classification_name,
  )

  if (regResult) {
    // req.flash create the message which then can be rendered using message() in the view
    req.flash(
      "notice",
      `The classification "${classification_name}" was successfully added.`
    )
    res.status(201).render("./inventory/inv-management", {
      title: "Inventory Managament",
      nav,
      errors: null, //THis is needed otherwise the app will crash because will get an undefined n the view if we're using <% if (errors) { %>
       
    })
  } else {
    req.flash("notice", "Sorry, the new classification registration failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      
    })
  }
}

/* ***************************
 *  Build inventory by add a classification
 * ************************** */
invCont.buildAddVehicles = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await invModel.getClassifications()
  res.render("./inventory/add-vehicle", {
    title: 'Add a new Vehicle',
    nav,
    classifications,
    errors: null,
  })
}

/* ****************************************
*  Register new Vehicle
* *************************************** */
invCont.registerVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id } = req.body

  
  const regResult = await classificationModel.addNewVehicle(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )

  if (regResult) {
    // req.flash create the message which then can be rendered using message() in the view
    console.log("regResult:", regResult)
    req.flash(
      "notice",
      `The "${inv_make} ${inv_model}" vehicle was successfully added.`
    )
    res.status(201).render("./inventory/inv-management", {
      title: "Inventory Managament",
      nav,
      errors: null, //THis is needed otherwise the app will crash because will get an undefined n the view if we're using <% if (errors) { %>
       
    })
  } else {
    let classifications = await invModel.getClassifications()
    console.log("error in query:")
    req.flash("notice", "Sorry, the new vehicle registration failed, please try again.")
    res.status(501).render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classifications,
      errors: null,
      
    })
  }
}

module.exports = invCont


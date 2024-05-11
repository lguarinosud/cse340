const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
module.exports = invCont


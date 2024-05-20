const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const className = await inventoryModel.checkExistingClassName(classification_name)
            console.log("className: ", className)
            if (className){
              throw new Error("Classification exists!")
              }
          }),
    ]
  }

  /* ******************************
 * Check classification name and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    console.log("DEBUG: checkClassData")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors, 
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    console.log("Errors: ", errors)
    next()
  }

/*  **********************************
  *  Vehicle Data Validation Rules
  * ********************************* */
validate.vehicleRules = () => {
  return [
    // classification_id is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification"), // on error this message is sent.

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // inv_make is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model."), // on error this message is sent.
    
    // inv_year is required and must be string
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("Please provide a year"), // on error this message is sent.

    // inv_description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description"), // on error this message is sent.

    // inv_image is required and must be string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a image path"), // on error this message is sent.

    // inv_thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path"), // on error this message is sent.

    // inv_price is required and must be string
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a price"), // on error this message is sent.
    
    // inv_miles is required and must be string
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide milage"), // on error this message is sent.
    
    // inv_color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color"), // on error this message is sent.

  ]
}

/* ******************************
 * Check classification name and return errors or continue to registration
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const {  
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id } = req.body
  console.log("DEBUG: checkVehicleData")
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await invModel.getClassifications()
    res.render("inventory/add-vehicle", {
      errors, 
      classifications,
      title: "Add Vehicle",
      nav,
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
    })
    return
  }
  console.log("Errors: ", errors)
  next()
}

  module.exports = validate
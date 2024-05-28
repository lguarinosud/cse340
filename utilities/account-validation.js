const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail() // refer to validator.js docs
         .withMessage("A valid email is required.")
        //  .custom(async (account_email) => {
        //    const emailExists = await accountModel.checkExistingEmail(account_email)
        //    console.log("emailExists: ", emailExists)
        //    if (emailExists){
        //      throw new Error("Email exists. Please log in or use different email")
        //      }
        //  }),
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email);
          console.log("emailExists: ", emailExists);
        
          // Check if rowCount is greater than 0, which indicates the email exists
          if (emailExists.rowCount > 0) {
            throw new Error("Email exists. Please log in or use different email");
          }
        }),
        
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    console.log("DEBUG: validationsRegistration")
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors, 
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    console.log("Errors: ", errors)
    next()
  }



  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
      
      // valid email is required and cannot already exist in the database
      body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail() // refer to validator.js docs
         .withMessage("A valid email is required.")
         .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            console.log("emailExists", emailExists)
            if ( emailExists == 0 ){ //If there is no match, then the user doesn't exists or the email is wrong 
              throw new Error("Password or EMAIL incorrect, please try again")
              }
            
          }),
        
    // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkUserLogin = async (req, res, next) => {
    const { account_email } = req.body
    console.log("DEBUG: validationsCheckUser")
    let errors = []
    errors = validationResult(req)
    console.log("ERROR: ", errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    console.log("Errors: ", errors)
    next()
  }

  //Account Update validation rules

  validate.accountUpdateRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
         .trim()
         .isEmail()
         .normalizeEmail() // refer to validator.js docs
         .withMessage("A valid email is required.")
        //  .custom(async (account_email) => {
        //    const emailExists = await accountModel.checkExistingEmail(account_email)
        //    console.log("emailExists: ", emailExists)
        //    if (emailExists){
        //      throw new Error("Email exists. Please log in or use different email")
        //      }
        //  }),
        .custom(async (account_email, { req }) => {
          const original_account_id = req.body.account_id; 
          console.log("original_account_id: ", original_account_id)
          const emailExists = await accountModel.checkExistingEmail(account_email);
          console.log("emailExists: ", emailExists);
        
          // Check if rowCount is greater than 0, which indicates the email exists
          if (emailExists.rowCount > 0 && emailExists.data.account_id != original_account_id) {
            throw new Error("Email exists. please use a different email address");
          }
        }),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkAccountUpdate = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    console.log("DEBUG: checkAccountUpdate")
    let errors = []
    errors = validationResult(req)
    console.log("ERROR: ", errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./account/accountUpdate", {
        errors,
        title: "Update Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    console.log("Errors: ", errors)
    next()
  }

  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.accountPasswordUpdateRules = () => {
  return [
      
  // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

 /* ******************************
 * Check Password and return errors or continue to password update
 * ***************************** */
 validate.checkPasswordUpdate = async (req, res, next) => {
  const { account_id } = req.body
  console.log("DEBUG: validationsCheckUser")
  let errors = []
  errors = validationResult(req)
  console.log("ERROR: ", errors)
  if (!errors.isEmpty()) {
    //let nav = await utilities.getNav()
    //const msj = []
    errors.array().forEach(error =>
      req.flash("notice", error.msg)
    )
    res.redirect(`/account/update/${account_id}`)
    return
  }
  console.log("Errors: ", errors)
  next()
}

module.exports = validate
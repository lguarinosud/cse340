const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email ///This one was replace by getAccountByemail()
 * ********************* */
// async function checkExistingEmail(account_email){
//     try {
//         console.log("email: ", account_email)
//       const sql = "SELECT * FROM account WHERE account_email = $1"
//       const email = await pool.query(sql, [account_email]);
      
//       console.log("row:", email)
//       return email.rowCount
//     } catch (error) {
//         console.log("error: in checkExistingMail", error )
//       return error.message
//     }
//   }

async function checkExistingEmail(account_email) {
  try {
    console.log("email: ", account_email);
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);

    console.log("row:", result);
    
    // If there's exactly one row, return the row data along with the row count
    if (result.rowCount === 1) {
      return {
        rowCount: result.rowCount,
        data: result.rows[0]
      };
    }
    
    // If there are multiple rows or no rows, return just the row count
    return {
      rowCount: result.rowCount,
      data: null
    };
  } catch (error) {
    console.log("error: in checkExistingMail", error);
    return { error: error.message };
  }
}


  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account_id found")
  }
}

    /* **********************
 *   Check Password getAccountById
 * ********************* */
    async function checkUser(account_email, account_password) {
        try {
          const sql = "SELECT account_password = $1 AS password_match FROM account WHERE account_email = $2";
          const result = await pool.query(sql, [account_password, account_email]);
          console.log("result:", result.rows[0])
          return result.rows[0].password_match;
        } catch (error) {
          return error.message;
        }
      }

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    console.log(account_id, account_firstname, account_lastname, account_email)  
    const sql =
      "UPDATE public.account SET  account_firstname = $2, account_lastname = $3, account_email = $4  WHERE  account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id, account_firstname, account_lastname, account_email  
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Password
 * ************************** */
async function updatePassword(account_id, account_password) {
  try {
    console.log(account_id, account_password)  
    const sql =
      "UPDATE public.account SET  account_password = $2 WHERE  account_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      account_id, account_password
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

      
module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  checkUser, 
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
      
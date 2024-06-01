const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

//module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1;`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getinventorybyId error " + error)
  }
}

/* *****************************
*   Register new Classification
* *************************** */
async function addClassifaction(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* **********************
 *   Check for Classification name
 * ********************* */
async function checkExistingClassName(classification_name){
  try {
      console.log("classification_name: ", classification_name)
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const className = await pool.query(sql, [classification_name]);
    
    console.log("row:", className)
    return className.rowCount
  } catch (error) {
      console.log("error: in checkExistingClassName", error )
    return error.message
  }
}

/* **********************
 *   Add a new vehicle
 * ********************* */
async function addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    console.log(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)  
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    return result.rows[0]; // Return the inserted row
    
  } catch (error) {
    return error.message
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    console.log(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)  
    const sql =
      "UPDATE public.inventory SET inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10,  classification_id= $11 WHERE  inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    console.log("delete inv_id:", inv_id)  
    sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error: " + error)
  }
}

/* ***************************
 *  Search in Inventory Data
 * ************************** */

async function searchInventory(keywords) {
  // Split the keywords into an array and wrap each keyword with '%'
  const keywordsArray = keywords.split(' ').map(keyword => `%${keyword}%`);

  // Build the SQL query
  const sql = `
    SELECT inv.*, cls.classification_name
    FROM inventory inv
    JOIN classification cls ON inv.classification_id = cls.classification_id
    WHERE 
      inv.inv_make ILIKE ANY ($1::text[])
      OR inv.inv_model ILIKE ANY ($1::text[])
      OR inv.inv_year ILIKE ANY ($1::text[])
      OR inv.inv_description ILIKE ANY ($1::text[])
      OR inv.inv_color ILIKE ANY ($1::text[])
      OR cls.classification_name ILIKE ANY ($1::text[]);
  `;

  try {
    // Execute the query
    const result = await pool.query(sql, [keywordsArray]);
    return result.rows;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}


// // Example usage
// const keywords = 'blue ford';
// searchInventory(keywords)
//   .then(results => {
//     console.log('Search results:', results);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });


module.exports = {getClassifications, 
                  getInventoryByClassificationId, 
                  getInventoryByInventoryId, 
                  addClassifaction, 
                  checkExistingClassName, 
                  addNewVehicle, 
                  updateInventory,
                  deleteInventory,
                  searchInventory,
                };
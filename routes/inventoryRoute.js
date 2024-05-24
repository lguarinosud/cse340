// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities"); // Import the utilities module
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory ID view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/inv-management", utilities.handleErrors(invController.buildInvManagement));

// Route to build GET add-Inventory view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build POST add-Inventory view
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
       utilities.handleErrors(invController.registerClassification)
    
  )

// Route to build GET add-vehicle view
router.get("/add-vehicle", utilities.handleErrors(invController.buildAddVehicles));

//Route to build POST add-vehicle view
router.post(
    "/add-vehicle",
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.registerVehicle)
    
  )

  // Route to build GET Inventory by classification in inv-management view
  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

  // Route to Edit Inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to Update a vehicle
router.post("/update/", 
invValidate.newvehicleRules(),
invValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory));

// Route to Delete Inventory view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));

// Route to Delete a vehicle 
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));


module.exports = router;
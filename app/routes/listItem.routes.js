module.exports = app => {
  const listItems = require("../controllers/listItem.controller.js");
  
    var router = require("express").Router();
  
    // Create a new ListItem
    router.post("/", listItems.create);

    // Create a new Sale for listItem with id
    router.put("/sale/:id", listItems.createSale);
  
    // Retrieve all ListItems
    router.get("/", listItems.findAll);

    // Retrieve all active ListItems
    router.get("/active/", listItems.findAllActive);
  
    // Retrieve a single ListItem with id
    router.get("/:id", listItems.findOne);
  
    // Update a Sale with id
    // Not working - do we even want to be able to update a sale?
    // Add and delete would be enough
    // router.put("/sale/:id/:saleid", listItems.updateSale);
  
    // Update a ListItem with id
    router.put("/:id", listItems.update);
  
    // Delete a ListItem with id
    router.delete("/:id", listItems.delete);

    // Delete a sale within listitem given both ids
    router.delete("/sale/:id/:saleid", listItems.deleteSale);
  
    // Create a new ListItem
    router.delete("/", listItems.deleteAll);
  
    app.use("/api/listItems", router);
  };
  
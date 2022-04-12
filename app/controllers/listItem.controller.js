const { response } = require("express");
const db = require("../models");
const ListItem = db.listItems;
const Sale = db.sales;

// Create and Save a new ListItem
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a ListItem
  const listItem = new ListItem({
    name: req.body.name,
    details: req.body.details,
    quantity: req.body.quantity,
    quantityUnit: req.body.quantityUnit,
    priority: req.body.priority,
    forDate: req.body.forDate,
    recipeLink: req.body.recipeLink,
    listItemDict: req.body.listItemDict,
    sales: req.body.sales,
    boughtAt: req.body.boughtAt,
    notBuyingAt: req.body.notBuyingAt,
  });

  // Save ListItem in the database
  listItem
    .save(listItem)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the List Item.",
      });
    });
};

// Create and Save a new sale within a listitem
// TODO: Improve efficiency - add sale without having to retreive and update the whole listitem
exports.createSale = (req, res) => {
  // Validate request
  if (!req.body.store) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Sale
  const sale = new Sale({
    store: req.body.store,
    price: req.body.price,
    quantity: req.body.quantity,
    quantityUnit: req.body.quantityUnit,
    details: req.body.details,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  const id = req.params.id;

  ListItem.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found ListItem with id " + id });
      else {
        data._doc.sales.push(sale);
        ListItem.findByIdAndUpdate(id, data, { useFindAndModify: false })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update ListItem with id=${id}. Maybe ListItem was not found!`,
              });
            } else res.send({ message: "Sale was added successfully." });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating ListItem with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving ListItem with id=" + id });
    });

  // // Save ListItem in the database
  // listItem
  //   .save(listItem)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the List Item."
  //     });
  //   });
};

// Find all active listitems, those that have not been bought (don't have boughtAt date set),
// and also have not been removed from list (don't have notBuyingAt date set)
exports.findAllActive = (req, res) => {
  ListItem.find({ boughtAt: null, notBuyingAt: null })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Retrieve all ListItems from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  ListItem.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving list items.",
      });
    });
};

// Find a single ListItem with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ListItem.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found ListItem with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving ListItem with id=" + id });
    });
};

// Update a ListItem by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  ListItem.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update ListItem with id=${id}. Maybe ListItem was not found!`,
        });
      } else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating ListItem with id=" + id,
      });
    });
};

// Update a ListItem Sale by the ids in the request
// TODO: Didn't work properly
// May be unnecessary anyway
// exports.updateSale = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }

//   const id = req.params.id;
//   const saleId = req.params.saleid;

//   ListItem.findOneAndUpdate(
//     {"_id": id, "sales._id": saleId}, req.body,{ useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: 'Cannot update Sale with id=${saleId}. Maybe sale was not found.'
//         });
//       } else res.send({ message: "Sale was updated successfully."});
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating sale with id=" + saleId
//       });
//     });
// };

// Delete a ListItem with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ListItem.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete ListItem with id=${id}. Maybe ListItem was not found!`,
        });
      } else {
        res.send({
          message: "ListItem was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete ListItem with id=" + id,
      });
    });
};

// Delete a sale with the specified id and saleid in the request
// TODO: Improve efficiency and error handling; delete without retrieving listitem
exports.deleteSale = (req, res) => {
  const id = req.params.id;
  const saleid = req.params.saleid;

  ListItem.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found ListItem with id " + id });
      else {
        var removeSale = data._doc.sales
          .map((x) => {
            return x._id;
          })
          .indexOf(saleid);
        if (removeSale >= 0) {
          data._doc.sales.splice(removeSale, 1);
          ListItem.findByIdAndUpdate(id, data, { useFindAndModify: false })
            .then((data) => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot update ListItem with id=${id}. Maybe ListItem was not found!`,
                });
              } else res.send({ message: "Sale was deleted successfully." });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating ListItem with id=" + id,
              });
            });
        } else res.send({ message: "Sale was not found." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving ListItem with id=" + id });
    });
};

// Delete all ListItems from the database.
exports.deleteAll = (req, res) => {
  ListItem.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} ListItems were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all list items.",
      });
    });
};

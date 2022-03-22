const { response } = require("express");
const db = require("../models");
const itemDictionary = db.itemDictionary;

// Create and Save a new Dictionary Item
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a ListItem
  const dictionaryItem = new itemDictionary({
    _id: req.body._id,
    name: req.body.name,
    aisle: req.body.aisle,
    aisleSort: req.body.aisleSort,
    avgWeightPerItem: req.body.avgWeightPerItem,
    weightUnit: req.body.weightUnit,
  });

  // Save ListItem in the database
  dictionaryItem
    .save(dictionaryItem)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Dictionary Item.",
      });
    });
};

// Retrieve all Dictionary Items from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  itemDictionary
    .find(condition)
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

// // Find a single ListItem with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   ListItem.findById(id)
//     .then(data => {
//       if (!data)
//         res.status(404).send({ message: "Not found ListItem with id " + id });
//       else res.send(data);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving ListItem with id=" + id });
//     });
// };

// // Update a ListItem by the id in the request
// exports.update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }

//   const id = req.params.id;

//   ListItem.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update ListItem with id=${id}. Maybe ListItem was not found!`
//         });
//       } else res.send({ message: "ListItem was updated successfully." });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating ListItem with id=" + id
//       });
//     });
// };

// // Delete a ListItem with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   ListItem.findByIdAndRemove(id, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete ListItem with id=${id}. Maybe ListItem was not found!`
//         });
//       } else {
//         res.send({
//           message: "ListItem was deleted successfully!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete ListItem with id=" + id
//       });
//     });
// };

const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.listItems = require("./listItem.model.js")(mongoose);
db.sales = require("./sale.model.js")(mongoose);
db.itemDictionary = require("./itemDictionary.model.js")(mongoose);

module.exports = db;

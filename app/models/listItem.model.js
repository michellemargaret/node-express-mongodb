module.exports = (mongoose) => {
  var listItemDictSchema = mongoose.Schema({
    name: String,
    details: String,
    aisle: String,
    aisleSort: Number,
    avgWeightPerItem: Number,
    weightUnit: String,
  });

  var saleSchema = mongoose.Schema({
    store: String,
    price: Number,
    quantity: Number,
    quantityUnit: String,
    details: String,
    startDate: Date,
    endDate: Date,
  });

  var schema = mongoose.Schema(
    {
      name: String,
      details: String,
      quantity: Number,
      quantityUnit: String,
      priority: String,
      forDate: Date,
      recipeLink: String,
      listItemDict: listItemDictSchema,
      sales: [saleSchema],
      boughtAt: Date,
      notBuyingAt: Date,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object._id = _id;
    return object;
  });

  const ListItem = mongoose.model("listItem", schema);
  return ListItem;
};

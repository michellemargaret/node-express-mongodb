module.exports = (mongoose) => {
  var itemDictionarySchema = mongoose.Schema({
    _id: String,
    name: String,
    details: String,
    aisle: String,
    aisleSort: Number,
    avgWeightPerItem: Number,
    weightUnit: String,
  });

  itemDictionarySchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object._id = _id;
    return object;
  });

  const itemDictionary = mongoose.model("itemDictionary", itemDictionarySchema);
  return itemDictionary;
};

module.exports = mongoose => {
  
    var saleSchema = mongoose.Schema(
      {
        store: String,
        price: Number,
        quantity: Number,
        quantityUnit: String,
        details: String,
        startDate: Date,
        endDate: Date
      }
    )
    
      saleSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object._id = _id;
        return object;
      });
    
      const sale = mongoose.model("sale", saleSchema);
      return sale;
    };
    
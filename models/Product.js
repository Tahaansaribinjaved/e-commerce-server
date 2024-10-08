const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',  // References the Category model (M:1 relationship)
      required: true
    },
    images: [String],  // Array of image URLs
  });
  
  const Product = mongoose.model('Product', productSchema);
  
  module.exports = Product;
  
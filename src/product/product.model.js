import mongoose, { Schema } from "mongoose";

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  price: {
    type: Number,
    required: [true, "The price is required"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  stock: {
    type: Number,
    required: [true, "The stock quantity is required"],
    default: 0,
  },
  quantitySales: {
    type: Number,
    default: 0,
  },
  condition: {
    type: Boolean,
    default: true,
  },
});

ProductsSchema.methods.toJSON = function () {
  const { __v, _id, ...resto } = this.toObject();
  resto.uid = _id;
  return resto;
};
export default mongoose.model("Products", ProductsSchema);

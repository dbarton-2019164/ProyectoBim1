import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"]
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1, 
    },
  }],
  total: {
    type: Number,
  },
  condition: {
    type: Boolean,
    default: true,
  },
});

cartSchema.methods.toJSON = function () {
  const { __v, _id, ...resto } = this.toObject();
  resto.uid = _id;
  return resto;
};
export default mongoose.model("CartShopping", cartSchema);

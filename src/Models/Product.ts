import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

export default model("Product", ProductSchema);

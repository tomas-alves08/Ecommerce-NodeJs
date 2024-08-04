import mongoose, { Schema } from "mongoose";
const OrderSchema = mongoose.Schema;
import { IProductWithQty, IProduct } from "../util/schemas";
import Product from "./product";

const orderSchema: Schema = new OrderSchema({
  products: [
    {
      productData: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

export = mongoose.model("Order", orderSchema);

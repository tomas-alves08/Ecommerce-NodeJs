import Product from "./product";
import mongoose, { Schema } from "mongoose";
import { ICartItem, IUser } from "../util/schemas";

const UserSchema = mongoose.Schema;

const userSchema: Schema<IUser> = new UserSchema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (
  product: InstanceType<typeof Product>
) {
  const cartProductIndex = this.cart?.items?.findIndex(
    (prod: ICartItem) => prod.productId.toString() === product._id?.toString()
  );

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  try {
    this.cart = updatedCart;
    return await this.save();
  } catch (err: any) {
    console.log(err.message);
  }
};

userSchema.methods.removeFromCart = function (productId: string) {
  const updatedCartItems = (this.cart.items as ICartItem[]).filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  return await this.save();
};

export = mongoose.model("User", userSchema);

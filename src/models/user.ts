import { ObjectId } from "mongodb";
import { getDb } from "../util/database";
import { ICart, IProduct, IProductWithQty, IUser } from "../util/schemas";
import { Product } from "./product";

export class User implements IUser {
  name: string;
  email: string;
  cart: ICart;
  _id: ObjectId;

  constructor(username: string, email: string, cart: ICart, id: string) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = new ObjectId(id);
  }

  async save() {
    try {
      const db = getDb();
      return await db.collection("users").insertOne(this);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async addToCart(product: Product) {
    const cartProductIndex = this.cart?.items?.findIndex(
      (prod) => prod.productId.toString() === product._id?.toString()
    );

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    try {
      const db = getDb();
      return await db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async getCart() {
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: this._id });

    const prodItems = (user?.cart.items as ICart["items"]) || [];

    return await Promise.all(
      prodItems.map(async (item) => {
        const product = (await db
          .collection("products")
          .findOne({ _id: item.productId })) as IProductWithQty | null;
        if (product) {
          const productWithQty: IProductWithQty = {
            ...product,
            quantity: item.quantity,
          };

          return productWithQty;
        }

        return null;
      })
    ).then(
      (products) =>
        products.filter((prod) => prod !== null) as IProductWithQty[]
    );
  }

  async deleteItemFromCart(productId: string) {
    const db = getDb();

    const updatedCartItems = (this.cart.items as ICart["items"]).filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    return await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  async getOrders() {
    const db = getDb();
    const orders = await db.collection("orders").find().toArray();

    const ordersWithProducts: IProductWithQty = await Promise
      .all
      // orders.map((order) => {})
      ();
  }

  async addOrder() {
    const db = getDb();
    await db.collection("orders").insertOne(this.cart);
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );
  }

  static async findById(userId: string) {
    try {
      const db = getDb();
      const id = new ObjectId(userId);

      const user = await db.collection("users").findOne({ _id: id });
      return user
        ? Object.assign(
            new User(user.name, user.email, user.cart, user._id.toString()),
            user
          )
        : null;
    } catch (err: any) {
      console.log(err.message);
    }
  }
}

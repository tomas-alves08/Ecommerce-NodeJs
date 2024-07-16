import { IProduct } from "../util/schemas";
import fs from "fs";
import path from "path";
import { Cart } from "./cart";

export const products: Array<IProduct> = [];

const filePath = path.join(
  path.dirname(require.main?.filename || ""),
  "data",
  "products.json"
);

const getProductsFromFile = (
  callbackFn: (products: Array<IProduct>) => void
) => {
  return fs.readFile(filePath, (err, fileContent) => {
    if (err) return callbackFn([]);
    return callbackFn(JSON.parse(fileContent.toString()));
  });
};

export class Product {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  static products: Array<IProduct> = products;

  constructor(
    title: string,
    imageUrl: string,
    description: string,
    price: number,
    id?: string
  ) {
    if (id) this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products: Array<IProduct>) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(callbackFn: (products: Array<IProduct>) => void) {
    getProductsFromFile(callbackFn);
  }

  static findById(id: string, callbackFn: Function) {
    getProductsFromFile((products: Array<IProduct>) => {
      const product = products.find((prod) => prod.id === id);
      callbackFn(product);
    });
  }

  //   update(id: string, updatedInfo: IProduct) {
  //     const foundProduct = this.fetchOneProduct(id);
  //     const index = products.findIndex((prod) => prod.id === id);

  //     const updatedProduct = { ...foundProduct, ...updatedInfo };
  //     products[index] = updatedProduct;
  //   }

  static deleteById(id: string) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);

      console.log("Class id: ", id);
      console.log("Products without deleted one: ", updatedProducts);

      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
        if (!err) Cart.deleteProduct(id, Number(product?.price));
      });
    });
  }
}

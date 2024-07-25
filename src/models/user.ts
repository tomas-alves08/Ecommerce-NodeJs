import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Product } from "./product";
import { Cart } from "./cart";
import { Order } from "sequelize";
import { Order as OrderModel } from "./order";

@Table({
  tableName: "Users",
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @HasOne(() => Cart)
  cart!: Cart;

  @HasMany(() => OrderModel)
  orders!: Order[];

  @HasMany(() => Product)
  products!: Product[];

  // Define the method signature for getProducts
  public getProducts!: () => Promise<Product[]>;
  public getCart!: () => Promise<Cart>;
  public createCart!: () => Promise<Cart>;
  public getOrder!: () => Promise<Order>;
  public createOrder!: () => Promise<Order>;
}

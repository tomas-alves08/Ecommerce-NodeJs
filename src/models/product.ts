import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user";
import { Cart } from "./cart";
import { CartItem } from "./cart-item";
import { Order } from "./order";
import { OrderItem } from "./order-item";

@Table({
  tableName: "Products",
})
export class Product extends Model<Product> {
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
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  imageUrl!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  UserId!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Cart, () => CartItem)
  carts!: Cart[];

  @BelongsToMany(() => Order, () => OrderItem)
  orders!: Order[];
}

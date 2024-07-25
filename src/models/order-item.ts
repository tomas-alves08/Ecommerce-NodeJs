import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Cart } from "./cart";
import { Product } from "./product";
import { Order } from "./order";

@Table({
  tableName: "OrderItems",
})
export class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  OrderId!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProductId!: string;
}

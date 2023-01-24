import { model, models, Schema, Types } from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    category: string;
    picture: string;
    _id: Types.ObjectId;
  }

const ProductSchema = new Schema<IProduct>({
    name: String,
    description: String,
    price: Number,
    category: String,
    picture: String,
    _id: Types.ObjectId
})

const Product = models?.Product || model<IProduct>('Product', ProductSchema );

export default Product;
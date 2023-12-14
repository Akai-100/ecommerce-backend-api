import { Schema, model } from 'mongoose'

import { dev } from '../config'
import { IProduct } from '../types/productTypes'

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Product title must be at least 3 characters long'],
      maxlength: [200, 'Product title must be at most 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: dev.app.defaultProductImagePath,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlingth: [3, 'Description must be at least 3 characters long'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
)

export const Product = model<IProduct>('Products', productSchema)

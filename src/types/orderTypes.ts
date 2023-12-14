import { Document } from 'mongoose'

import { IProduct } from './productTypes'
import { IUser } from './userTypes'

export interface IOrder extends Document {
  _id: string
  buyer: IUser['_id']
  orderItems: IOrderItem[]
  amount: number
  totalProducts: number
  status: 'Not Processed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

export interface IOrderItem {
  product: IProduct['_id']
  qty: number
}

export interface IUpdatedProduct {
  id: string
  newQuantity: number
  newSold: number
}

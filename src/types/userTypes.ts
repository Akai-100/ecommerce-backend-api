import { Document } from 'mongoose'

import { IOrder } from './orderTypes'

export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  image: string
  isAdmin: boolean
  isBanned: boolean
  orders: IOrder['_id'][]
}

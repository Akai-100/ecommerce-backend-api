import { Schema, model } from 'mongoose'

import { dev } from '../config'
import { IUser } from '../types/userTypes'

const usersSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [30, 'First name must be at most 30 characters'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [30, 'Last name must be at most 30 characters'],
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [2, 'User name must be at least 2 characters'],
      maxlength: [30, 'User name must be at most 30 characters'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
        message: 'Enter a valid email address',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    image: {
      type: String,
      default: dev.app.defaultUserImagePath,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: 'Orders',
      default: [],
    },
  },
  { timestamps: true }
)

export const User = model<IUser>('Users', usersSchema)

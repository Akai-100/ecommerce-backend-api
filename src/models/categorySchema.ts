import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Category title must be at least 3 characters long'],
      maxlength: [200, 'Category title must be at most 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
)

export const Category = model('Categories', categorySchema)

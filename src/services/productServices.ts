import { Request } from 'express'
import createHttpError from 'http-errors'
import { SortOrder } from 'mongoose'
import slugify from 'slugify'

import { deleteImage } from '../helper/deleteImageHelper'
import { Product } from '../models/productSchema'
import { IProduct } from '../types/productTypes'

export const findProducts = async (
  page: number,
  limit: number,
  minPrice: number,
  maxPrice: number,
  search: string,
  sortPrice: SortOrder
) => {
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)

  const regExpSearch = new RegExp('.*' + search + '.*', 'i') //i => case-insensitive
  const filter = {
    $or: [{ title: { $regex: regExpSearch } }, { description: { $regex: regExpSearch } }], //search title or description
    $and: [{ price: { $gt: minPrice } }, { price: { $lt: maxPrice } }], // price range between min and max
  }

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0
  const products = await Product.find(filter, { createdAt: 0, updatedAt: 0, __v: 0 })
    .populate({ path: 'category', select: '_id title' })
    .skip(skip)
    .limit(limit)
    .sort({ price: sortPrice })

  if (products.length === 0) {
    throw createHttpError(404, 'There are no products in database')
  }

  return {
    products,
    currentPage: page,
    totalPages,
  }
}

export const findProductBySlug = async (slug: string): Promise<IProduct> => {
  const product = await Product.findOne(
    { slug: slug },
    { createdAt: 0, updatedAt: 0, __v: 0 }
  ).populate({ path: 'category', select: '_id title' })

  if (!product) {
    const error = createHttpError(404, `Product not found with this slug: ${slug}`)
    throw error
  }
  return product
}

export const removeProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug: slug })
  if (!product) {
    const error = createHttpError(404, `Product not found with this slug: ${slug}`)
    throw error
  }

  await deleteImage(String(product.image))
  await Product.deleteOne({ _id: product })

  return product
}

export const createProduct = async (req: Request) => {
  const { title, price, description, category, quantity, sold, shipping } = req.body

  const productExsist = await Product.exists({ title: title })
  if (productExsist) {
    const error = createHttpError(
      409,
      `Product already exist with this title: ${title} (Try different title)`
    )
    throw error
  }

  const newProduct: IProduct = new Product({
    title: title,
    price: price,
    slug: slugify(title),
    description: description,
    quantity: quantity,
    category: category,
    sold: sold,
    shipping: shipping,
  })
  await newProduct.save()
  return newProduct
}

export const updateProduct = async (req: Request) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title)
  }
  if (req.file) {
    req.body.image = req.file.path
  }

  const product = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
  })
  if (!product) {
    const error = createHttpError(404, `Product not found with this slug: ${req.params.slug}`)
    throw error
  }
  return product
}

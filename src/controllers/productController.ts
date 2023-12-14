import { NextFunction, Request, Response } from 'express'
import { SortOrder } from 'mongoose'

import {
  createProduct,
  findProductBySlug,
  findProducts,
  removeProductBySlug,
  updateProduct,
} from '../services/productServices'

// GET : /products => get all products with pagination
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    let minPrice = Number(req.query.minPrice) || 0
    let maxPrice = Number(req.query.maxPrice) || 5000
    let search = (req.query.search as string) || ''
    let sortPrice = (req.query.sortPrice as SortOrder) || 'asc'

    const result = await findProducts(page, limit, minPrice, maxPrice, search, sortPrice)

    res.status(200).json({
      message: 'Products returned',
      payload: {
        products: result.products,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET : /products/:slug => get single product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await findProductBySlug(req.params.slug)

    res.status(200).json({ message: 'Single product returned', payload: product })
  } catch (error) {
    next(error)
  }
}

// DELETE : /products/:slug => delete single product by slug
export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await removeProductBySlug(req.params.slug)
    res.status(200).json({
      message: 'Single product deleted',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

// POST : /products => create new product
export const createSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProduct(req)
    res.status(201).json({
      message: 'Single product created',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

// PUT : /products/:slug => update single product by slug
export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await updateProduct(req)
    res.status(200).json({
      message: 'Single product updated',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

import { NextFunction, Request, Response } from 'express'

import {
  createCategory,
  findCategories,
  findCategoryBySlug,
  removeCategoryBySlug,
  updateCategory,
} from '../services/categoryServices'

// GET : /categories => get all categories with pagination
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const result = await findCategories(page, limit)

    res.status(200).json({
      message: 'Categories returned',
      payload: {
        categories: result.categories,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET : /categories/:slug => get single category by slug
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const category = await findCategoryBySlug(slug)

    res.status(200).json({
      message: 'Single category returned',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE : /categories/:slug => delete single category by slug
export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const category = await removeCategoryBySlug(slug)

    res.status(200).json({
      message: 'Single product deleted',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

// POST : /categories => create new category
export const createSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const category = await createCategory(title)

    res.status(201).json({
      message: 'Single category created',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

// PUT : /categories/:slug => update single category by slug
export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldSlug = req.params.slug
    const { title } = req.body

    const category = await updateCategory(title, oldSlug)
    res.status(200).json({
      message: 'Single category updated',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

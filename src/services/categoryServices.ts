import createHttpError from 'http-errors'
import slugify from 'slugify'

import { Category } from '../models/categorySchema'

export const findCategories = async (page: number, limit: number) => {
  const count = await Category.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0

  const categories = await Category.find().skip(skip).limit(limit)

  if (categories.length === 0) {
    throw createHttpError(404, 'There are no categories in database')
  }

  return {
    categories,
    currentPage: page,
    totalPages,
  }
}

export const findCategoryBySlug = async (slug: string) => {
  try {
    const category = await Category.find({ slug })
    if (category.length === 0) {
      const error = createHttpError(404, `Category not found with this slug: ${slug}`)
      throw error
    }
    return category
  } catch (error) {
    throw error
  }
}

export const removeCategoryBySlug = async (slug: string) => {
  const category = await Category.findOneAndDelete({ slug: slug })
  if (!category) {
    const error = createHttpError(404, `Category not found with this slug: ${slug}`)
    throw error
  }
  return category
}

export const createCategory = async (title: string) => {
  const slug = slugify(title)
  await checkCategoryExistBySlug(slug)

  const newCategory = new Category({
    title,
    slug,
  })
  await newCategory.save()
  return newCategory
}

export const updateCategory = async (newTitle: string, oldSlug: string) => {
  const newSlug = slugify(newTitle)
  await checkCategoryExistBySlug(newSlug)
  const category = await Category.findOneAndUpdate(
    { slug: oldSlug },
    { title: newTitle, slug: newSlug },
    { new: true }
  )
  if (!category) {
    const error = createHttpError(404, `Category not found with this slug: ${oldSlug}`)
    throw error
  }
  return category
}

export const checkCategoryExistBySlug = async (slug: string) => {
  const categoryExist = await Category.find({ slug })
  if (categoryExist.length >= 1) {
    const error = createHttpError(
      409,
      `Category already exists with this title: ${slug} (Try different title)`
    )
    throw error
  }
  return categoryExist
}

import { Router } from 'express'

import {
  createSingleCategory,
  deleteCategoryBySlug,
  getCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
} from '../controllers/categoryController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { runValidation } from '../validation'
import { validateCreateCategory, validateUpdateCategory } from '../validation/categoryValidation'

const router = Router()

// Admin & User Routes
router.get('/', getCategories)

router.get('/:slug', getCategoryBySlug)

// Only Admin Routes
router.delete('/:slug', isLoggedIn, isAdmin, deleteCategoryBySlug)

router.put(
  '/:slug',
  isLoggedIn,
  isAdmin,
  validateUpdateCategory,
  runValidation,
  updateCategoryBySlug
)

router.post('/', isLoggedIn, isAdmin, validateCreateCategory, runValidation, createSingleCategory)

export default router

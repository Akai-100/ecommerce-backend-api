import { Router } from 'express'

import {
  createSingleProduct,
  deleteProductBySlug,
  getProductBySlug,
  getProducts,
  updateProductBySlug,
} from '../controllers/productController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'
import { uploadProduct } from '../middlewares/uploadFile'
import { runValidation } from '../validation'
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation'

const router = Router()

// Admin & User Routes
router.get('/', getProducts)

router.get('/:slug', getProductBySlug)

// Only Admin Routes
router.delete('/:slug', isLoggedIn, isAdmin, deleteProductBySlug)

router.post('/', isLoggedIn, isAdmin, validateCreateProduct, runValidation, createSingleProduct)

router.put(
  '/:slug',
  isLoggedIn,
  isAdmin,
  uploadProduct.single('image'),
  validateUpdateProduct,
  runValidation,
  updateProductBySlug
)

export default router

import { check, ValidationChain } from 'express-validator'

export const validateCreateProduct: ValidationChain[] = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters long'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number greater than 0'),
  check('image').optional().isLength({ min: 1 }),
  check('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Category must be a valid Mongo ID'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3, max: 400 })
    .withMessage('Description must be between 3 and 400 characters long'),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive number greater than 0'),
  check('sold').optional().isInt({ min: 0 }).withMessage('Sold must be greater than or equal to 0'),
  check('shipping')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Shipping must be greater than or equal to 0'),
]

export const validateUpdateProduct: ValidationChain[] = [
  check('title')
    .trim()
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters long'),
  check('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number greater than 0'),
  check('image').optional().isLength({ min: 1 }).withMessage('Image can not be empty'),
  check('category').trim().optional().isMongoId().withMessage('Category must be a valid Mongo ID'),
  check('description')
    .trim()
    .optional()
    .isLength({ min: 3, max: 400 })
    .withMessage('Description must be between 3 and 400 characters long'),
  check('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive number greater than 0'),
  check('sold').optional().isInt({ min: 0 }).withMessage('Sold must be greater than or equal to 0'),
  check('shipping')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Shipping must be greater than or equal to 0'),
]

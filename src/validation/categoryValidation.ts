import { check, ValidationChain } from 'express-validator'

export const validateCreateCategory: ValidationChain[] = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Category title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Category name must be between 3 and 200 characters long'),
]

export const validateUpdateCategory: ValidationChain[] = [
  check('title')
    .trim()
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters long'),
]

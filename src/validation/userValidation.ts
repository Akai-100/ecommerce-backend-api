import { ValidationChain, check } from 'express-validator'

export const validateCreateUser: ValidationChain[] = [
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 3 and 200 characters long'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be between 3 and 200 characters long'),
  check('userName')
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('User name must be between 3 and 200 characters long'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Not a valid e-mail address'),
]

export const validateUpdateProfile: ValidationChain[] = [
  check('firstName')
    .trim()
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 3 and 200 characters long'),
  check('lastName')
    .trim()
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name must be between 3 and 200 characters long'),
]

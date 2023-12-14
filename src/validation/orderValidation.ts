import { ValidationChain, check } from 'express-validator'

export const validatePlaceOrder: ValidationChain[] = [
  check('orderItems')
    .notEmpty()
    .withMessage('Order items is required')
    .isArray({ min: 1 })
    .withMessage('Order items must be have at least 1 item'),
]

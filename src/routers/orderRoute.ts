import { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getSingleOrderById,
  getUserOrders,
  placeNewOrder,
  updateOrderStatusById,
} from '../controllers/orderController'
import { isAdmin, isLoggedIn, isNotAdmin } from '../middlewares/auth'
import { runValidation } from '../validation'
import { validatePlaceOrder } from '../validation/orderValidation'

const router = Router()

// Only Admin Routes

router.get('/', isLoggedIn, isAdmin, getAllOrders)

router.get('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, getSingleOrderById)

router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, deleteOrderById)

router.put('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, updateOrderStatusById)

// Only User Routes

router.get('/user', isLoggedIn, isNotAdmin, getUserOrders)

router.post('/', isLoggedIn, isNotAdmin, validatePlaceOrder, runValidation, placeNewOrder)

export default router

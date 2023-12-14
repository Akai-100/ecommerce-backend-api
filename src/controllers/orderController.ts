import { NextFunction, Request, Response } from 'express'

import { CustomRequest } from '../middlewares/auth'
import { Order } from '../models/orderSchema'
import {
  findAllOrders,
  findOrderById,
  findOrdersByUserId,
  placeOrder,
  removeOrderById,
  updateOrderStatus,
} from '../services/orderServices'

// GET : /orders => get all orders with pagination (Admin Only)
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const result = await findAllOrders(page, limit)

    res.status(200).json({
      message: 'Orders returned',
      payload: {
        orders: result.existingOrders,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET : /orders/:id => get single order by id (Admin Only)
export const getSingleOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    const order = await findOrderById(id)

    res.status(200).json({
      message: 'Order returned',
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}

// GET : /orders/user => get logged in user orders (User Only)
export const getUserOrders = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const order = await findOrdersByUserId(String(req.userId))

    res.status(200).json({
      message: 'Orders returned',
      payload: order,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE : /orders/:id => delete single order by id (Admin Only)
export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    await removeOrderById(id)

    res.status(200).json({
      message: 'Order deleted',
    })
  } catch (error) {
    next(error)
  }
}

// POST : /orders => place new order (User Only)
export const placeNewOrder = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const newOrder = await placeOrder(req)
    res.status(201).json({
      message: 'Order placed successfully, and stock updated',
      payload: newOrder,
    })
  } catch (error) {
    next(error)
  }
}

// PUT : /orders/:id => update order status (Admin Only)
export const updateOrderStatusById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedOrder = await updateOrderStatus(req)
    res.status(200).json({
      message: 'Order status updated successfully',
      payload: updatedOrder,
    })
  } catch (error) {
    next(error)
  }
}

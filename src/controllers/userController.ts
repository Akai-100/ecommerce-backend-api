import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { CustomRequest } from '../middlewares/auth'
import {
  createUser,
  findUserById,
  findUserByUserName,
  findUsers,
  removeUserByUserName,
  sendToken,
  updateBanStatus,
  updateProfile,
  userActivate,
} from '../services/userServices'

// GET : /users => get all users with pagination (Admin Only)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    let search = (req.query.search as string) || ''

    const result = await findUsers(page, limit, search)

    res.status(200).json({
      message: 'Users returned',
      payload: {
        users: result.users,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET : /users/:userName => get single user by userName (Admin Only)
export const getUserByUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await findUserByUserName(userName)

    res.status(200).json({
      message: 'Single user returned',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

// DELETE : /users/:userName => delete single user by userName (Admin Only)
export const deleteUserByUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await removeUserByUserName(userName)

    res.status(200).json({
      message: 'Single user deleted',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

// PUT : /users/updateBan/:userName => update ban status by userName (Admin Only)
export const updateBanStatusByUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userName = req.params.userName
    const user = await updateBanStatus(userName)
    res.status(200).send({
      message: 'User status is updated',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

// POST : /users => create new user (Admin Only)
export const createSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await createUser(req, res, next)
    res.status(201).json({
      message: 'User created',
      payload: newUser,
    })
  } catch (error) {
    next(error)
  }
}

// POST : /users/process-register => register new account (User Only)
export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const register = await sendToken(req, res, next)

    res.status(200).json({
      message: 'Check your Email to activate your account',
    })
  } catch (error) {
    next(error)
  }
}

// GET : /users/activate/:token => activate new account (User Only)
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userActivate(req, res, next)

    res.status(201).json({
      message: 'User activated',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage = error instanceof TokenExpiredError ? 'expired token' : 'Invalid token'
      next(Error(errorMessage))
    } else {
      next(error)
    }
  }
}

// GET : /users/user/profile => get logged in user profile
export const getUserProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(String(req.userId))

    res.status(200).json({
      message: 'Single user returned',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

// PUT : /users/user/profile => update user profile
export const updateUserProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await updateProfile(req)
    res.status(200).send({
      message: 'User profile updated',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { dev } from '../config'
import { User } from '../models/userSchema'

export interface CustomRequest extends Request {
  userId?: string
}

export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw createHttpError(401, 'You are not logged in')
    }

    const decoded = jwt.verify(accessToken, String(dev.app.jwtAccessKey)) as JwtPayload
    if (!decoded) {
      throw createHttpError(401, 'Invalied access token')
    }

    req.userId = decoded.id

    next()
  } catch (error) {
    next(error)
  }
}

export const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (accessToken) {
      throw createHttpError(401, 'You are already logged in')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      throw new Error(`User not found with this user id ${user}`)
    }
    if (user.isAdmin) {
      next()
    } else {
      throw createHttpError(403, 'You are not admin')
    }
  } catch (error) {
    next(error)
  }
}

export const isNotAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      throw new Error(`User not found with this user id ${user}`)
    }
    if (user.isAdmin) {
      throw createHttpError(403, 'Admin can not access this route')
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

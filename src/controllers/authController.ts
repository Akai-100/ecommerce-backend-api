import { NextFunction, Request, Response } from 'express'

import { login } from '../services/authServices'
import generateToken from '../util/generateToken'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await login(email, password)

    res.cookie('access_token', generateToken(String(user._id)), {
      maxAge: 15 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: 'none',
    })

    res.status(200).send({ message: 'User is logged in', payload: user })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.status(200).send({ message: 'User is logged out' })
  } catch (error) {
    next(error)
  }
}

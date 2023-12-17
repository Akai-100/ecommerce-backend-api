import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

import { dev } from '../config'
import { deleteImage } from '../helper/deleteImageHelper'
import { EmailDataType, handleSendEmail } from '../helper/sendEmail'
import { CustomRequest } from '../middlewares/auth'
import { User } from '../models/userSchema'
import { IUser } from '../types/userTypes'

export const findUsers = async (page: number, limit: number, search: string) => {
  const count = await User.countDocuments()
  const totalPages = Math.ceil(count / limit)

  const regExpSearch = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [{ firstName: { $regex: regExpSearch } }, { email: { $regex: regExpSearch } }],
  }

  if (page > totalPages) {
    page = totalPages
  }

  let skip = (page - 1) * limit
  if (skip < 0) skip = 0

  const users = await User.find(filter, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)

  if (users.length === 0) {
    throw createHttpError(404, 'There are no users in database')
  }

  return {
    users,
    currentPage: page,
    totalPages,
  }
}

export const findUserByUserName = async (userName: string) => {
  try {
    const user = await User.find({ userName }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    if (user.length === 0) {
      const error = createHttpError(404, `User not found with this user name: ${userName}`)
      throw error
    }
    return user
  } catch (error) {
    throw error
  }
}

export const findUserById = async (id: string) => {
  try {
    const user = await User.findById(id, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    if (!user) {
      const error = createHttpError(404, `User not found with this ID: ${id}`)
      throw error
    }
    return user
  } catch (error) {
    throw error
  }
}

export const removeUserByUserName = async (userName: string) => {
  const user = await User.findOne({ userName: userName })
  if (!user) {
    const error = createHttpError(404, `User not found with this user name: ${userName}`)
    throw error
  }
  await deleteImage(String(user.image))
  await User.deleteOne({ _id: user })

  return user
}

export const updateProfile = async (req: CustomRequest): Promise<IUser | null> => {
  const id = req.userId
  const { firstName, lastName } = req.body
  const image = req.file?.path

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { firstName, lastName, image },
    { new: true }
  )

  if (!updatedUser) {
    const error = createHttpError(404, `User not found with this ID: ${id}`)
    throw error
  }
  return updatedUser
}

export const updateBanStatus = async (userName: string): Promise<IUser | null> => {
  const user = await User.findOne({ userName: userName })
  if (!user) {
    const error = createHttpError(404, `User not found with this user name ${userName}`)
    throw error
  }
  const updatedUser = await User.findOneAndUpdate(
    { userName: userName },
    { isBanned: !user?.isBanned },
    { new: true }
  )
  return updatedUser
}

export const updateRole = async (userName: string): Promise<IUser | null> => {
  const user = await User.findOne({ userName: userName })
  if (!user) {
    const error = createHttpError(404, `User not found with this user name ${userName}`)
    throw error
  }
  const updatedUser = await User.findOneAndUpdate(
    { userName: userName },
    { isAdmin: !user?.isAdmin },
    { new: true }
  )
  return updatedUser
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, userName, email, password } = req.body

  const userExsistByEmail = await User.exists({ email: email })
  const userExsistByUserName = await User.exists({ userName: userName })

  if (userExsistByUserName) {
    const error = createHttpError(
      409,
      `User already exist with this user name: ${userName} (Try different user name)`
    )
    throw error
  }
  if (userExsistByEmail) {
    const error = createHttpError(
      409,
      `User already exist with this email: ${email} (Try different email)`
    )
    throw error
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: IUser = new User({
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hashedPassword,
  })
  await newUser.save()

  return newUser
}

export const sendToken = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, userName, email, password } = req.body

  const userExsistByEmail = await User.exists({ email: email })
  const userExsistByUserName = await User.exists({ userName: userName })

  if (userExsistByUserName) {
    const error = createHttpError(
      409,
      `User already exist with this user name: ${userName} (Try different user name)`
    )
    throw error
  }
  if (userExsistByEmail) {
    const error = createHttpError(
      409,
      `User already exist with this email: ${email} (Try different email)`
    )
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const tokenPayload = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hashedPassword,
  }

  const token = jwt.sign(tokenPayload, String(dev.app.jwtUserActivationKey), { expiresIn: '5m' })

  const emailData: EmailDataType = {
    email: email,
    subject: 'Activate Your Account',
    html: `<h1>Hello ${firstName}</h1><p>Please activate your account by clicking the following link: <a href="http://localhost:3000/activation/${token}">Click Here</a></p><p>Link will expire in 5 minutes</p>`,
  }
  await handleSendEmail(emailData)

  return token
}

export const userActivate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token

  if (!token) {
    const error = createHttpError(404, 'Please provide a token')
    throw error
  }

  const decoded = jwt.verify(token, String(dev.app.jwtUserActivationKey))

  if (!decoded) {
    const error = createHttpError(401, 'Invalid token')
    throw error
  }
  await User.create(decoded)
}

import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'

import { User } from '../models/userSchema'

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email })

  if (!user) {
    throw createHttpError(404, 'User not found with this email')
  }

  const isPasswordMatch = await bcrypt.compare(password, String(user.password))
  if (!isPasswordMatch) {
    throw createHttpError(401, "Password doesn't match")
  }

  if (user.isBanned) {
    throw createHttpError(403, 'User is banned, please contact support')
  }

  return user
}

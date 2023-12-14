import jwt from 'jsonwebtoken'

import { dev } from '../config'

const generateToken = (id: string) => {
  return jwt.sign({ id }, String(dev.app.jwtAccessKey), {
    expiresIn: '1h',
  })
}

export default generateToken

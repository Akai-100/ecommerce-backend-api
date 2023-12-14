import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'

export const errorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
  })
}

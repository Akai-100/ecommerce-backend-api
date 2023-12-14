import { NextFunction, Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'

export const runValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    let errorList: string[] = errors.array().map((error: ValidationError) => error.msg)
    return res.status(422).send({
      error: errorList[0],
    })
  }
  next()
}

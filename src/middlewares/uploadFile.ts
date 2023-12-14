import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { Product } from '../models/productSchema'

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const userStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const fileFilter = async (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const productExsist = await Product.exists({ title: req.body.title })

  if (productExsist) {
    return cb(
      new Error(`Product already exist with this title: ${req.body.title} (Try different title)`)
    )
  }

  const allowTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('File is not image'))
  }
  if (!allowTypes.includes(file.mimetype)) {
    return cb(new Error('Image type is not allowed'))
  }
  cb(null, true)
}

export const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: fileFilter,
})

export const uploadUser = multer({
  storage: userStorage,
  limits: { fileSize: 1024 * 1024 * 1 },
  fileFilter: fileFilter,
})

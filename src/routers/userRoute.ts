import { Router } from 'express'

import {
  activateUser,
  createSingleUser,
  deleteUserByUserName,
  getUserByUserName,
  getUserProfile,
  getUsers,
  processRegisterUser,
  updateBanStatusByUserName,
  updateUserProfile,
} from '../controllers/userController'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'
import { uploadUser } from '../middlewares/uploadFile'
import { runValidation } from '../validation'
import { validateCreateUser, validateUpdateProfile } from '../validation/userValidation'

const router = Router()

// Only Admin Routes

// router.get('/', isLoggedIn, isAdmin, getUsers)

// router.get('/:userName', isLoggedIn, isAdmin, getUserByUserName)

// router.delete('/:userName', isLoggedIn, isAdmin, deleteUserByUserName)

// router.post('/', isLoggedIn, isAdmin, validateCreateUser, runValidation, createSingleUser)

// router.put('/updateBan/:userName', isLoggedIn, isAdmin, updateBanStatusByUserName)

router.get('/', getUsers)

router.get('/:userName', getUserByUserName)

router.delete('/:userName', deleteUserByUserName)

router.post('/', createSingleUser)

router.put('/updateBan/:userName', updateBanStatusByUserName)

// Only User Routes

router.post(
  '/process-register',
  validateCreateUser,
  runValidation,
  isLoggedOut,
  processRegisterUser
)

router.get('/activate/:token', isLoggedOut, activateUser)

// Admin & User Routes

router.get('/user/profile', isLoggedIn, getUserProfile)

router.put(
  '/user/profile',
  isLoggedIn,
  uploadUser.single('image'),
  validateUpdateProfile,
  runValidation,
  updateUserProfile
)

export default router

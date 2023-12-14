import { Router } from 'express'

import { handleLogin, handleLogout } from '../controllers/authController'
import { isLoggedIn, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.post('/login', isLoggedOut, handleLogin)

router.post('/logout', isLoggedIn, handleLogout)

export default router

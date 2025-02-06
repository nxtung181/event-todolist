import  express  from "express"
import { UserController } from "./user.controller"
import { validate } from "express-validation"
import { create, forgotPassword, signIn } from "./user.validation"
const router = express.Router()

router.post('/signup', validate(create), UserController.signUp)
router.post('/signin', validate(signIn), UserController.signIn)
router.post('/refresh-token', UserController.refreshToken)
router.post('/forgot-password', validate(forgotPassword), UserController.forgotPassword)
router.post('/verify-otp', UserController.verifyOTP)
router.post('/reset-password', UserController.resetPassword);
router.delete('/logout', UserController.logout)

export default router
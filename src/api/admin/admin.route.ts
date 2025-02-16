import { AuthMiddleware } from "@api/auth/auth.middleware"
import  express  from "express"
import { AdminController } from "./admin.controller"
import { validate } from "express-validation"
import { list } from "./admin.validation"
const router = express.Router()

router.get('/stats/general', AuthMiddleware.requireAuth, AuthMiddleware.checkAdmin, AdminController.getGeneralStats)
router.get('/stats/general-test', AuthMiddleware.requireAuth, AuthMiddleware.checkAdmin, AdminController.getGeneralStats1)

router.get('/stats/user-tasks', AuthMiddleware.requireAuth, AuthMiddleware.checkAdmin, validate(list, {context: true}), AdminController.getUserTaskStats)
router.get('/stats/user-tasks-test', AuthMiddleware.requireAuth, AuthMiddleware.checkAdmin, validate(list, {context: true}), AdminController.getUserTaskStats1)
export default router
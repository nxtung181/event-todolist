import express from 'express'
import { TaskController } from './task.controller'
import { AuthMiddleware } from '@api/auth/auth.middleware'
import { validate } from 'express-validation'
import { createTask, editTask, listTask} from './task.validation'

const router = express.Router()

router.post('/', AuthMiddleware.requireAuth, validate(createTask, {context: true}) ,TaskController.createTask)
router.get('/', AuthMiddleware.requireAuth, validate(listTask, {context: true}) ,TaskController.getAllTasks)
router.get('/search', AuthMiddleware.requireAuth, validate(listTask, {context: true}), TaskController.searchTask)
// router.get('/summary', AuthMiddleware.requireAuth, TaskController.getUserStat)
router.get('/summary1', AuthMiddleware.requireAuth, TaskController.getUserStat1)
router.get('/:id', AuthMiddleware.requireAuth, TaskController.getTaskById)
router.put('/:id', AuthMiddleware.requireAuth, validate(editTask, {context: true}),TaskController.editTaskById)
router.delete('/:id', AuthMiddleware.requireAuth, TaskController.deleteTaskById)
router.post('/:id/share', AuthMiddleware.requireAuth, TaskController.shareTask)

router.post('/createManyTask', TaskController.createManyTask)
export default router
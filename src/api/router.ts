import express, { Request, Response } from 'express';
import { NODE_ENV } from '@config/environment';
// import sampleRoutes from './sample/sample.route';
import userRoutes from './user/user.route'
import taskRoutes from './task/task.route'
import adminRoutes from './admin/admin.route'
const router = express.Router();

/**
 * GET /status
 */
router.use('/user', userRoutes)
router.use('/tasks', taskRoutes)
router.use('/admin', adminRoutes)

export default router;

import { TaskService } from '@common/task/task.service';
import { Request, Response, NextFunction } from 'express';

export class TaskController {
    static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, content, status } = req.body;
            const userId = req.user.id;
            const result = await TaskService.createTask(title, content, status, userId);
            res.sendJson({ message: 'create task successfully', data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const query = req.query;
            const tasks = await TaskService.getAllTasks(
                userId,
                parseInt(query.page.toString(), 10),
                parseInt(query.pageSize.toString(), 10),
            );
            res.sendJson({ data: tasks });
        } catch (error) {
            next(error);
        }
    }

    static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const taskId = req.params.id;
            const task = await TaskService.getTaskById(taskId);
            res.sendJson({ data: task });
        } catch (error) {
            next(error);
        }
    }

    static async editTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const taskId = req.params.id;
            const userId = req.user.id
            const { title, content, status } = req.body;
            const task = await TaskService.editTaskById(userId, taskId, title, content, status);
            console.log("ra controller")
            console.log(task)
            res.sendJson({ message: 'edit successfully', data: task });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const taskId = req.params.id;
            const userId = req.user.id
            await TaskService.deleteTaskById(userId, taskId);
            res.sendJson({ message: 'delete successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async searchTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query;
            const userId = req.user.id;
            const tasks = await TaskService.searchTask(
                userId,
                query.title as string,
                query.status as string,
                parseInt(query.page.toString(), 10),
                parseInt(query.pageSize.toString(), 10),
            );
            res.sendJson({ data: tasks });
        } catch (error) {
            next(error);
        }
    }

    static async getUserStat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const stats = await TaskService.getStatOfUser(userId);
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }
}

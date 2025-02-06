import Task from '@common/task/Task';
import { ITaskMany } from '@common/task/task.interface';
import { TaskService } from '@common/task/task.service';
import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import uuid from 'uuid-random';
import bcrypt from 'bcryptjs';
import { MySQLDataSource } from '@common/infrastructure/mysql.adapter';
import { User } from '@common/user/User';
import TaskStatistic from '@common/task/TaskStatistic';

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
        // try {
        //     const userId = req.user.id;
        //     const stats = await TaskService.getStatOfUser(userId);
        //     res.sendJson({ data: stats });
        // } catch (error) {
        //     next(error);
        // }
    }

    static async getUserStat1(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const stats = await TaskService.getStatOfUser1(userId);
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async shareTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const taskId = req.params.id
            const sharedWithUserIds: string[] = req.body.shareWith
            await TaskService.shareTask(taskId, sharedWithUserIds)
            res.send({message: "shared successfully"})
        }catch(error){
            next(error);
        }
    }

    static async createManyTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const taskBatchSize = 118; // Sử dụng batch insert để tăng tốc
            const userRepository = MySQLDataSource.getRepository(User);

            for (let i = 35100; i <= 40000; i++) {
                // Tạo user
                const user = new User();
                const userId = uuid();
                const hashedPassword = bcrypt.hashSync(`test${i}`, 10);

                user.id = userId;
                user.name = `test${i}`; // Định dạng name
                user.email = `test${i}@gmail.com`; // Định dạng email
                user.password = hashedPassword;
                user.isAdmin = false;

                await userRepository.save(user);

                // Tạo 10000 tasks cho user
                const tasks: ITaskMany[] = Array.from({ length: 118 }, () => ({
                    title: faker.lorem.words(3),
                    content: faker.lorem.sentences(2),
                    status: faker.helpers.arrayElement(['todo', 'completed', 'progressing']),
                    userId: userId,
                }));

                // Biến để theo dõi số lượng task theo trạng thái
                const statusCounts: Record<string, number> = { todo: 0, completed: 0, progressing: 0 };

                // Chia nhỏ batch task để insert
                for (let j = 0; j < tasks.length; j += taskBatchSize) {
                    const taskBatch = tasks.slice(j, j + taskBatchSize);

                    // Cập nhật số lượng task theo trạng thái
                    taskBatch.forEach((task) => {
                        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
                    });

                    // Thực hiện insert batch task
                    await Task.insertMany(taskBatch);
                    
                }

                // Cập nhật bảng TaskStatistic
                const taskStatistic = new TaskStatistic();
                taskStatistic.userId = userId;
                taskStatistic.totalTask = tasks.length; // Tổng số task
                taskStatistic.todo = statusCounts.todo
                taskStatistic.progressing = statusCounts.progressing
                taskStatistic.completed = statusCounts.completed
                await taskStatistic.save();
            }

            res.send('Tạo thành công user và task, cập nhật bảng TaskStatistic');
        } catch (error) {
            next(error);
        }
    }
}

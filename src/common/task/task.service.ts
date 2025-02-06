import { APIError } from '@common/error/api.error';
import Task from './Task';
import httpStatus from 'http-status';
import { ErrorCode } from '@config/errors';
import TaskStatistic, { ITaskStatistic } from './TaskStatistic';
import eventbus from '@common/eventbus';
import { EVENT_CREATE_TASK, EVENT_DELETE_TASK, EVENT_EDIT_TASK } from './task.event';
import { ITask, ITaskEdit, ITaskRes } from './task.interface';
import TaskShare from './TaskShare';
import _ from 'lodash';

export class TaskService {
    static async createTask(title: string, content: string, status: string, userId: string): Promise<ITask> {
        const task = new Task({ title, content, status, userId });
        await task.save();
        eventbus.emit(EVENT_CREATE_TASK, task);
        return task;
    }
    static async getAllTasks(userId: string, page: number, pageSize: number): Promise<ITaskRes | null> {
        const tasks = await Task.find({ userId })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();
        if (!tasks) {
            throw new APIError({
                message: 'No task',
                status: httpStatus.NOT_FOUND,
                errorCode: ErrorCode.REQUEST_NOT_FOUND,
            });
        }
        const totalTasks = await Task.countDocuments({ userId });
        const totalPage = Math.ceil(totalTasks / pageSize);
        return { tasks, page, pageSize, totalPage };
    }

    static async getTaskById(taskId: string): Promise<ITask | null> {
        const task = await Task.findOne({ _id: taskId }).lean();
        if (!task) {
            throw new APIError({
                message: 'No task',
                status: httpStatus.NOT_FOUND,
                errorCode: ErrorCode.REQUEST_NOT_FOUND,
            });
        }
        return task;
    }

    static async editTaskById(
        userId: string,
        taskId: string,
        title: string,
        content: string,
        status: string,
    ): Promise<ITask | null> {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: userId },
            { title, content, status },
            { returnOriginal: true, includeResultMetadata: false },
        );
        if (!task) {
            throw new APIError({
                message: 'Task not found',
                status: httpStatus.NOT_FOUND,
                errorCode: ErrorCode.REQUEST_NOT_FOUND,
            });
        }
        const data: ITaskEdit = { userId, oldStatus: task.status, newStatus: status };
        eventbus.emit(EVENT_EDIT_TASK, data);
        task.status = status;
        return task;
    }

    static async deleteTaskById(userId: string, taskId: string): Promise<void> {
        const task = await Task.findOneAndDelete(
            { _id: taskId, userId },
            { returnOriginal: true, includeResultMetadata: false },
        );
        if (!task) {
            throw new APIError({
                message: 'Task not found',
                status: httpStatus.NOT_FOUND,
                errorCode: ErrorCode.REQUEST_NOT_FOUND,
            });
        }
        eventbus.emit(EVENT_DELETE_TASK, task);
    }

    static async searchTask(
        userId: string,
        title: string,
        status: string,
        page: number,
        pageSize: number,
    ): Promise<ITaskRes | null> {
        const query: Record<string, any> = {};
        query.userId = userId;
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (status) {
            query.status = status;
        }
        const tasks = await Task.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();
        const totalTasks = await Task.countDocuments(query);
        const totalPage = Math.ceil(totalTasks / pageSize);
        return { tasks, page, pageSize, totalPage };
    }

    static async shareTask(taskId: string, userIds: string[]): Promise<void> {
        let taskShare = await TaskShare.findOne({ taskId });
        if (!taskShare) {
            taskShare = new TaskShare({ taskId, userIds });
            await taskShare.save();
        } else {
            const sharedWithSet = new Set(taskShare.sharedWith);
            const newSharedWith = _.filter(userIds, (userId) => !sharedWithSet.has(userId));
            taskShare.sharedWith.push(...newSharedWith);
            await taskShare.save();
        }
    }
    static async getStatOfUser1(userId: string): Promise<ITaskStatistic> {
        const result = await TaskStatistic.findOne({ userId });
        return result;
    }
}

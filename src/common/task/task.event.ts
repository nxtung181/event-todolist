import eventbus from '@common/eventbus';
import { ITask, ITaskEdit } from '@common/task/task.interface';
import TaskStatistic from './TaskStatistic';

function timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const EVENT_CREATE_TASK = 'created_task';
export const EVENT_EDIT_TASK = 'edited_task';
export const EVENT_DELETE_TASK = 'deleted_task';

export class TaskEvent {
    public static register(): void {
        // register handler
        eventbus.on(EVENT_CREATE_TASK, TaskEvent.handleCreateStats);
        eventbus.on(EVENT_EDIT_TASK, TaskEvent.handleEditStats);
        eventbus.on(EVENT_DELETE_TASK, TaskEvent.handleDeleteStats);
    }

    private static async handleCreateStats(data: ITask): Promise<void> {
        await TaskStatistic.updateOne(
            { userId: data.userId },
            {
                $inc: {
                    totalTask: 1,
                    [`${data.status}`]: 1,
                },
            },
            {
                upsert: true,
            },
        );
    }

    private static async handleEditStats(data: ITaskEdit): Promise<void> {
        console.log(data);
        console.log('===>vào');
        console.time('===>updateStat:');
        if(data.oldStatus !== data.newStatus) {
            await TaskStatistic.updateOne(
                { userId: data.userId },
                {
                    $inc: {
                        [`${data.oldStatus}`]: -1,
                        [`${data.newStatus}`]: 1,
                    },
                },
            );
        }
        console.log('ra edit Stats');
        console.timeEnd('===>updateStat:');
    }
    private static async handleDeleteStats(data: ITask): Promise<void> {
        console.log(data);
        console.time('===>updateStat:');
        await TaskStatistic.updateOne(
            { userId: data.userId },
            {
                $inc: {
                    totalTask: -1,
                    [`${data.status}`]: -1,
                },
            },
        );
        console.timeEnd('===>updateStat:');
    }
}

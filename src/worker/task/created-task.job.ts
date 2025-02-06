import logger from "@common/logger";
import { QueueService } from "@common/queue/queue.service";
import { DoneCallback, Job, Queue } from "bull";
import { JOB_CREATED_TASK as JOB_NAME} from "@config/jobs";
import { log } from "console";
import { ITask } from "@common/task/task.interface";
import TaskStatistic from "@common/task/TaskStatistic";
export interface ITaskQueue {
    task: ITask;
}

export class CreatedTaskJob{
    static async register(): Promise<Queue<unknown>> {
        logger.info(`Listening to queue: ${JOB_NAME}`);
        const queue = await QueueService.getQueue(JOB_NAME);
        queue.process(CreatedTaskJob.handler);
        return queue;
    }

    static async handler(job: Job<ITaskQueue>, done: DoneCallback): Promise<void> {
        try {
            log("======> data: ", job.data.task)
            logger.debug(`Processing job ${JOB_NAME}-${job.id}`);
            console.log(job.data.task.userId)
            console.time("===>1:")
            await TaskStatistic.updateOne({userId: job.data.task.userId},
                {
                    $inc:{
                        totalTask: 1,
                        [`${job.data.task.status}`]: 1,
                    },
                },{
                    upsert: true,
                })
            console.timeEnd("===>1:")

            logger.debug(`Processed job ${JOB_NAME}-${job.id}`);
            done();
        } catch (error) {
            logger.error(`Process ${JOB_NAME} error: `, error);
            done(error);
        }
    }
}
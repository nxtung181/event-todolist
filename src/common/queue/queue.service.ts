import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';
import BullQueue, { JobStatusClean, Queue } from 'bull';

export class QueueService {
    private static queues: Map<string, Queue> = new Map<string, Queue>();

    static async getQueue<T = unknown>(jobName: string): Promise<Queue<T>> {
        let queue = QueueService.queues.get(jobName);
        console.log("=======>", queue)
        if (!queue) {
            queue = new BullQueue<T>(jobName, await RedisAdapter.getQueueOptions());
            queue.on('failed', (job, error) => {
                logger.error('Failed process job', { error, data: job });
            });
            queue.on('error', (error) => {
                logger.error('Error process queue', { error, data: { jobName } });
            });
            QueueService.queues.set(jobName, queue);
        }
        console.log("====> sau: ", queue)
        return queue;
    }

    async cleanQueues(period: number, type: JobStatusClean = 'completed'): Promise<unknown> {
        const promises = [];
        QueueService.queues.forEach((queue) => promises.push(queue.clean(period, type)));
        return Promise.all(promises);
    }
}

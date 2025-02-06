import { Job, DoneCallback, Queue } from 'bull';
import { JOB_GENERAL_REPORT as JOB_NAME } from '@config/jobs';
import logger from '@common/logger';
import { QueueService } from '@common/queue/queue.service';
import { MySQLDataSource } from '@common/infrastructure/mysql.adapter';
import { User } from '@common/user/User';
import TaskStatistic from '@common/task/TaskStatistic';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';

export class GeneralReportJob {
    static async register(): Promise<Queue<unknown>> {
        logger.info(`Listening to queue: ${JOB_NAME}`);
        const queue = await QueueService.getQueue<unknown>(JOB_NAME);
        console.log('======> đến');
        const timeDelayToCleanJob = 2 * 60 * 1000;
        const jobStatus = 'delayed';
        const jobOpts = {
            repeat: { cron: '* * * * *' },
        };
        await queue.clean(timeDelayToCleanJob, jobStatus);
        await queue.add({job: JOB_NAME}, jobOpts);

        await queue.process(GeneralReportJob.handler);
        return queue;
    }

    static async handler(job: Job<unknown>, done: DoneCallback): Promise<void> {
        try {
            logger.debug(`Processing job ${JOB_NAME}-${job.id}`);

            // Make some noise
            logger.info("I'm repeater");
            const result = await Promise.all([
                MySQLDataSource.getRepository(User).count({ where: { isAdmin: false } }),
                TaskStatistic.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalTask: { $sum: '$totalTask' },
                            todo: { $sum: '$todo' },
                            progressing: { $sum: '$progressing' },
                            completed: { $sum: '$completed' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            totalTask: 1,
                            todo: 1,
                            progressing: 1,
                            completed: 1,
                        },
                    },
                ]),
            ]);
            console.log('=======>ta ta ta at at at at');
            await RedisAdapter.set('general-report', result, 0, true);
            logger.debug(`Processed job ${JOB_NAME}-${job.id}`);
            done();
        } catch (error) {
            logger.error(`Process ${JOB_NAME} error: `, error);
            done(error);
        }
    }
}

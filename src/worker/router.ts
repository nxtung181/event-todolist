import { JobHandler } from './interface';
import { Queue } from 'bull';
import { MailForgotPasswordJob } from './user/mail-forgotPassword.job';
import { GeneralReportJob } from './statistic/general-repeated.job';

export class Router {
    static async register(): Promise<Queue[]> {
        // List job to register here
        const queues: JobHandler[] = [MailForgotPasswordJob, GeneralReportJob];

        return Promise.all(queues.map((queue) => queue.register()));
    }
}

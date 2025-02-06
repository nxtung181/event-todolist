import logger from "@common/logger";
import { QueueService } from "@common/queue/queue.service";
import { DoneCallback, Job, Queue } from "bull";
import { JOB_MAIL_FORGOT_PASSWORD as JOB_NAME} from "@config/jobs";
import nodemailer from 'nodemailer'
import { IUserForgotPass } from "@common/user/user.interface";
import { log } from "console";
import { RedisAdapter } from "@common/infrastructure/redis.adapter";
export interface ISampleJobData {
    name: string;
}

export class MailForgotPasswordJob{
    static async register(): Promise<Queue<unknown>> {
        logger.info(`Listening to queue: ${JOB_NAME}`);
        const queue = await QueueService.getQueue(JOB_NAME);
        queue.process(MailForgotPasswordJob.handler);
        return queue;
    }

    static async handler(job: Job<IUserForgotPass>, done: DoneCallback): Promise<void> {
        try {
            log("======> data email: ", job.data.email)
            logger.debug(`Processing job ${JOB_NAME}-${job.id}`);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: true,
                auth: {
                    user: "ngxuantung181@gmail.com",
                    pass: "hvqx cznx zsbv iyqs",
                },
            });

            const infor = await transporter.sendMail({
                from: `ngxuantung181@gmail.com`,
                to: job.data.email,
                subject: 'QUÊN MẬT KHẨU TÀI KHOẢN',
                text: ' QUÊN MẬT KHẨU TÀI KHOẢN',
                html: `
                <h3>Ma OTP cua ban la: <p style="background-color:green; padding:10px;box-sizing: border-box;">${job.data.otp}</p></h3>`,
            });
            await RedisAdapter.set(job.data.email, job.data.otp, 5*60);
            logger.debug(`Processed job ${JOB_NAME}-${job.id}`);
            console.log(infor.messageId);

            done();
        } catch (error) {
            logger.error(`Process ${JOB_NAME} error: `, error);
            done(error);
        }
    }
}
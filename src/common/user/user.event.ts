import eventbus from '@common/eventbus';
import { QueueService } from '@common/queue/queue.service';
import { JOB_MAIL_FORGOT_PASSWORD } from '@config/jobs';
import uuid from 'uuid-random';
import otpGen from 'otp-generator';

function timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const EVENT_FORGOT_PASSWORD = 'user_forgot_password';
export class UserEvent {
    public static register(): void {
        // register handler
        eventbus.on(EVENT_FORGOT_PASSWORD, UserEvent.handleForgotPassword);
    }

    private static async handleForgotPassword(data: string): Promise<void> {
        console.log('=====> data: ', data);
        const queue = await QueueService.getQueue(JOB_MAIL_FORGOT_PASSWORD);
        queue.add(
            {
                email: data,
                otp: otpGen.generate(6, {
                    digits: true,
                    lowerCaseAlphabets: true,
                    upperCaseAlphabets: true,
                    specialChars: false,
                }),
            },
            {
                jobId: data + uuid(),
            },
        );
    }
}

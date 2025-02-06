import logger from '@common/logger';
import { Queue } from 'bull';
import { Router } from './router';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';
import express from 'express';

/**
 * Abstraction around bull processor
 */
export class WorkerServer {
    private queues: Queue[];

    public async setup(): Promise<void> {
        await this.registerQueues();      
    }

    public async setBullBoard(): Promise<void> {
        console.log("vào day chua")
        const app = express();

        const serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/admin/queues');
        console.log("bay gio trong queue: ", this.queues)
        // createBullBoard({
        //     queues: this.queues.map((queue) => new BullAdapter(queue)),
        //     serverAdapter: serverAdapter,
        // });
        const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
            queues: [],
            serverAdapter: serverAdapter,
          });

        app.use('/admin/queues', serverAdapter.getRouter());

        app.listen(3000, () => {
            console.log('Server started on http://localhost:3000/admin/queues');
        });
        return;
    }
    
    public async kill(): Promise<unknown> {
        const promises = this.queues.map((queue) =>
            queue.close(false).catch((e) => logger.error('Error closing queue', e)),
        );
        return Promise.all(promises);
    }

    private async registerQueues(): Promise<void> {
        this.queues = await Router.register();
    }
}

import { WorkerServer } from './server';
import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { MySQLAdapter } from '@common/infrastructure/mysql.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';
import { TaskEvent } from '@common/task/task.event';
import { UserEvent } from '@common/user/user.event';
// import { UserEvent } from '@common/user/user.event';
// import { TrackingEvent } from '@common/tracking/tracking.event';

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */
export class Application {
    /**
     * Implement create application, connecting db here
     */
    public static async createApplication(): Promise<WorkerServer> {
        await DatabaseAdapter.connect();
        await MySQLAdapter.connect()
        await RedisAdapter.connect();

        Application.registerEvents();

        const server = new WorkerServer();
        await server.setup();
        await server.setBullBoard();
        Application.handleExit(server);

        return server;
    }

    /**
     * Register signal handler to graceful shutdown
     *
     * @param express Express server
     */
    private static handleExit(express: WorkerServer) {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1, express);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2, express);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    /**
     * Handle graceful shutdown
     *
     * @param exitCode
     * @param express
     */
    private static shutdownProperly(exitCode: number, server: WorkerServer) {
        Promise.resolve()
            .then(() => server.kill())
            .then(() => RedisAdapter.disconnect())
            .then(() => DatabaseAdapter.disconnect())
            .then(() => MySQLAdapter.disconnect())
            .then(() => {
                logger.info('Shutdown complete, bye bye!');
                process.exit(exitCode);
            })
            .catch((err) => {
                logger.error('Error during shutdown', err);
                process.exit(1);
            });
    }

    private static registerEvents() {
        UserEvent.register();
        TaskEvent.register();
    }
}

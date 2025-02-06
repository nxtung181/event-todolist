import logger from '@common/logger';
import { User } from '@common/user/User';
import { POSTGRES_HOST, POSTGRES_NAME, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '@config/environment';
import { DataSource, EntityTarget, Repository } from 'typeorm';

export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_NAME,
    synchronize: true, //Tạo bảng tự động từ entity nếu không có
    logging: false,
    entities: [__dirname + '/../statistic/TaskStat.ts'], // Đường dẫn đến các entity liên quan đến MySQL
});

export class PostgresAdapter {
    static async connect(): Promise<void> {
        try{
            await PostgresDataSource.initialize()
            logger.info('Connect to postgres successfully!');

        }catch(e){
            logger.error('Connect to postgres failed!', e);
            // Exit process with failure
            process.exit(1);
        }
    }

    static async disconnect() {
        try {
            PostgresDataSource.destroy();
            logger.info('disconnect Postgres successfully');
        } catch (error) {
            logger.error('Error during Postgres disconnection:', error);
        }
    }
}
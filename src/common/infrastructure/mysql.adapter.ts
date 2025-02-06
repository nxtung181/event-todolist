import logger from '@common/logger';
import { User } from '@common/user/User';
import { MYSQL_HOST, MYSQL_NAME, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from '@config/environment';
import { DataSource, EntityTarget, Repository } from 'typeorm';

export const MySQLDataSource = new DataSource({
    type: 'mysql',
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_NAME,
    synchronize: true, //Tạo bảng tự động từ entity nếu không có
    logging: false,
    entities: [__dirname + '/../user/User.ts'], // Đường dẫn đến các entity liên quan đến MySQL
});

export class MySQLAdapter {
    static async connect(): Promise<void> {
        try{
            await MySQLDataSource.initialize()
            logger.info('Connect to mysql successfully!');

        }catch(e){
            logger.error('Connect to mysql failed!', e);
            // Exit process with failure
            process.exit(1);
        }
    }

    static async disconnect() {
        try {
            MySQLDataSource.destroy();
            logger.info('disconnect MySQL successfully');
        } catch (error) {
            logger.error('Error during MySQL disconnection:', error);
        }
    }
}
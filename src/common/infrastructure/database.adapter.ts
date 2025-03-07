import mongoose, { ConnectOptions } from 'mongoose';
import bluebird from 'bluebird';
import logger from '@common/logger';
import { LOG_LEVEL, MONGODB_URI } from '@config/environment';
import { LOG_OUTPUT_JSON } from '@config/environment';

mongoose.Promise = bluebird;
if (LOG_LEVEL === 'debug') {
    if (LOG_OUTPUT_JSON) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            logger.debug(`Mongoose: ${collectionName}.${method}`, { stringData: JSON.stringify(query) });
        });
    } else {
        mongoose.set('debug', true);
    }
}

/**
 * Singleton Database client
 */
export class DatabaseAdapter {
    static async connect(): Promise<void> {
        try {
            // const options = {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            //     keepAlive: true,
            // };
            await mongoose.connect(MONGODB_URI);
            logger.info('Connected to MongoDB successfully!');
        } catch (error) {
            logger.error('Connection to MongoDB failed!', error);
            process.exit(1);
        }
    }
    static async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('Disconnect from mongodb successfully!');
        } catch (error) {
            logger.error('Disconnect from mongodb failed!', error);
        }
    }
}

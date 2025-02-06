import path from 'path'
import dotenv from 'dotenv-safe'

dotenv.config({
    path: path.join(__dirname + '../../../.env'),
    sample: path.join(__dirname + '../../../.env.example')
})

export const LOG_OUTPUT_JSON: boolean = process.env.LOG_OUTPUT_JSON === '1';

export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';

export const NODE_ENV: string = process.env.NODE_ENV || 'development';

export const PORT: number = parseInt(process.env.PORT, 10) || 3000

export const MYSQL_HOST: string= process.env.MYSQL_HOST
export const MYSQL_PORT: string = process.env.MYSQL_PORT
export const MYSQL_USER: string = process.env.MYSQL_USER
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD
export const MYSQL_NAME: string = process.env.MYSQL_NAME


export const POSTGRES_HOST: string= process.env.POSTGRES_HOST
export const POSTGRES_PORT: string = process.env.POSTGRES_PORT
export const POSTGRES_USER: string = process.env.POSTGRES_USER
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD
export const POSTGRES_NAME: string = process.env.POSTGRES_NAME

export const REDIS_URI = process.env.REDIS_URI

export const MONGODB_URI: string = process.env.MONGODB_URI;

export const APP_NAME: string = process.env.APP_NAME || 'demo_app';

export const ACCESS_TOKEN:string = process.env.ACCESS_TOKEN
export const REFRESH_TOKEN:string = process.env.REFRESH_TOKEN


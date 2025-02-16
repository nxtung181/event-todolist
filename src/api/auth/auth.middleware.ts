import { APIError } from '@common/error/api.error';
import { IUserRes } from '@common/user/user.interface';
import { ACCESS_TOKEN } from '@config/environment';
import { ErrorCode } from '@config/errors';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

export class AuthMiddleware {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                const err = new APIError({
                    message: 'Token is missing',
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_UNAUTHORIZED,
                });
                throw err;
            }
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, ACCESS_TOKEN) as IUserRes;
            if (decoded) {
                req.user = decoded as IUserRes;
                next();
            }
        } catch (e) {
            next(e);
        }
    }
    public static checkAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user.isAdmin) {
                throw new APIError({
                    message: 'Unauthorized',
                    status: httpStatus.UNAUTHORIZED,
                    errorCode: ErrorCode.REQUEST_FORBIDDEN,
                });
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}
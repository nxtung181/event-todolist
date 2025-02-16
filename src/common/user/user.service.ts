import { IToken, IUserLoginRes, IUserRes } from './user.interface';
import { User } from './User';
import { APIError } from '@common/error/api.error';
import { ErrorCode } from '@config/errors';
import { MySQLDataSource } from '@common/infrastructure/mysql.adapter';
import bcrypt from 'bcryptjs';
import uuid from 'uuid-random';
import eventbus from '@common/eventbus';
import { EVENT_FORGOT_PASSWORD } from './user.event';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { Token } from '@api/auth/token';
import httpStatus from 'http-status';

export class UserService {
    private static userRepository = MySQLDataSource.getRepository(User);
    static async signUp(name: string, email: string, password: string): Promise<IUserRes> {
        const existedUser = await this.userRepository.findOneBy({ email });
        if (existedUser) {
            throw new APIError({
                message: 'email already exists',
                status: httpStatus.UNAUTHORIZED,
                errorCode: ErrorCode.AUTH_ACCOUNT_EXISTS,
            });
        }
        const hashedPass = bcrypt.hashSync(password);
        const user = new User();
        user.id = uuid();
        user.name = name;
        user.email = email;
        user.password = hashedPass;
        user.isAdmin = false;        
        await this.userRepository.save(user);
        return user;
    }

    static async signIn(email: string, password: string): Promise<IUserLoginRes> {
        const user = await this.userRepository.findOneBy({ email });
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const [accessToken, refreshToken] = await Promise.all([
                    Token.generateAccessToken(user),
                    Token.generateRefreshToken(user),
                ]);
                const token: IToken = { accessToken, refreshToken };
                const userRes: IUserLoginRes = { user, token };
                return userRes;
            }
        }
        throw new APIError({
            message: 'invalid email or password',
            status: httpStatus.UNAUTHORIZED,
            errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
        });
    }

    static async refreshToken(refreshToken: string): Promise<IToken> {
        const payload = await Token.verifyRefreshToken(refreshToken);
        const [newAccessToken, newRefreshToken] = await Promise.all([
            Token.generateAccessToken(payload),
            Token.generateRefreshToken(payload),
        ]);
        const newToken: IToken = { accessToken: newAccessToken, refreshToken: newRefreshToken };
        return newToken;
    }

    static async logOut(refreshToken: string): Promise<void> {
        const payload = await Token.verifyRefreshToken(refreshToken);
        await Token.deleteRefreshToken(payload.id);
    }

    static async forgotPassword(email: string): Promise<void> {
        const existedUser = await this.userRepository.findOneBy({ email });
        if (!existedUser) {
            throw new APIError({
                message: 'email invalid',
                status: httpStatus.UNAUTHORIZED,
                errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
            });
        }
        console.log('=====> user: ', existedUser);
        eventbus.emit(EVENT_FORGOT_PASSWORD, email);
    }

    static async verifyOTP(email: string, otp: string): Promise<void> {
        const otpInRedis = await RedisAdapter.get(email);
        if (otp !== otpInRedis) {
            throw new APIError({
                message: 'OTP không đúng',
                status: httpStatus.UNAUTHORIZED,
                errorCode: ErrorCode.VERIFY_FAILED,
            });
        }
    }

    static async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });
        await UserService.verifyOTP(email, otp);
        const hashedPass = bcrypt.hashSync(newPassword);
        user.password = hashedPass;
        await this.userRepository.save(user);
    }
}

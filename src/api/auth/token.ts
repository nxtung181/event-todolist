import { IUserRes } from "@common/user/user.interface";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@config/environment";
import jwt from 'jsonwebtoken';
import {RedisAdapter} from "@common/infrastructure/redis.adapter"
import { APIError } from "@common/error/api.error";
import { ErrorCode } from "@config/errors";

export class Token {
    public static async generateAccessToken(payload: IUserRes): Promise<string>{
        if(payload){
            const accessToken = jwt.sign({id: payload.id, isAdmin: payload.isAdmin},
                                        ACCESS_TOKEN,
                                        {expiresIn: '2h'})
            return accessToken
        }
    }

    public static async generateRefreshToken(payload: IUserRes): Promise<string>{
        if(payload){
            const refreshToken = jwt.sign({id: payload.id, isAdmin: payload.isAdmin},
                                        REFRESH_TOKEN,
                                        {expiresIn: '1d'})
            await RedisAdapter.set(payload.id.toString(), refreshToken, 24*60*60)
            return refreshToken
        }
    }
    public static async verifyRefreshToken(token: string): Promise<IUserRes>{
        const decoded = jwt.verify(token, REFRESH_TOKEN) as IUserRes
        const tokenInRedis = await RedisAdapter.get(decoded.id as string)
        if(token !== tokenInRedis){
            throw new APIError({message: 'token invalid',status: ErrorCode.REQUEST_UNAUTHORIZED, errorCode: ErrorCode.REQUEST_UNAUTHORIZED})
        }
        return decoded
    }

    public static async deleteRefreshToken(id: string): Promise<void>{
        await RedisAdapter.delete(id)
    }
}
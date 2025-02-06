import { UserService } from '@common/user/user.service';
import { Request, Response, NextFunction } from 'express';

export class UserController {
    static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password } = req.body;
            const user = await UserService.signUp(name, email, password);
            res.sendJson({ data: user });
        } catch (error) {
            next(error);
        }
    }

    static async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await UserService.signIn(email, password);
            res.sendJson({ data: user });
        } catch (error) {
            next(error);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.body.refreshToken;
            const newToken = await UserService.refreshToken(refreshToken);
            res.sendJson({ data: newToken });
        } catch (error) {
            next(error);
        }
    }

    static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email = req.body.email;
            await UserService.forgotPassword(email);
            res.sendJson({ message: 'OTP was sent' });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.body.refreshToken;
            await UserService.logOut(refreshToken);
            res.sendJson({ meassage: 'Logout!' });
        } catch (error) {
            next(error);
        }
    }

    static async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            await UserService.verifyOTP(email, otp);
            res.sendJson({ messasge: 'OTP valid' });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp, newPassword } = req.body;
            await UserService.resetPassword(email, otp, newPassword);
            res.sendJson({ message: 'reset password successfully' });
        } catch (error) {
            next(error);
        }
    }
}

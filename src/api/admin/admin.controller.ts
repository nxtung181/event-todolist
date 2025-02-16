import { AdminService } from '@common/admin/admin.service';
import { Request, Response, NextFunction } from 'express';
export class AdminController {
    static async getGeneralStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await AdminService.getGeneralStats();
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }
    static async getUserTaskStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query;
            const stats = await AdminService.getUserTaskStats(
                parseInt(query.page.toString(), 10),
                parseInt(query.pageSize.toString(), 10),
                query.sort.toString()
            );
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async getGeneralStats1(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await AdminService.getGeneralStats1();
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }
    static async getUserTaskStats1(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query;
            const stats = await AdminService.getUserTaskStats1(
                parseInt(query.page.toString(), 10),
                parseInt(query.pageSize.toString(), 10),
                query.sort.toString()
            );
            res.sendJson({ data: stats });
        } catch (error) {
            next(error);
        }
    }
}

import { MySQLDataSource } from '@common/infrastructure/mysql.adapter';
import { IStatusCount, ITaskStatForUser, IGeneralStat, IAdminStat, ITaskStatForUser1 } from '@common/admin/admin.interface';
import TaskStatistic, { ITaskStatistic } from '@common/task/TaskStatistic';
import { User } from '@common/user/User';
import { In, ObjectId } from 'typeorm';
import { PostgresDataSource } from '@common/infrastructure/postgres.adapter';
import { TaskStat } from '@common/statistic/TaskStat';
import mongoose, { Schema, Types } from 'mongoose';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
export class AdminService {
    private static userRepository = MySQLDataSource.getRepository(User);
    private static statisticRepository = PostgresDataSource.getRepository(TaskStat)
    static async getGeneralStats(): Promise<IGeneralStat> {
        console.time('=====>1');
        const [totalUser, stats] = await Promise.all([
            this.userRepository.count({ where: { isAdmin: false } }),
            TaskStatistic.aggregate([
                {
                    $group: {
                        _id: null,
                        totalTask: { $sum: '$totalTask' },
                        todo: { $sum: '$todo' },
                        progressing: { $sum: '$progressing' },
                        completed: { $sum: '$completed' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalTask: 1,
                        todo: 1,
                        progressing: 1,
                        completed: 1,
                    },
                },
            ]),
        ]);
        console.timeEnd('=====>1');
        const countTaskByStatus: IStatusCount = {
            totalTask: stats[0].totalTask,
            todo: stats[0].todo,
            progressing: stats[0].progressing,
            completed: stats[0].completed,
        };
        const averageTaskPerUser = Math.ceil(countTaskByStatus.totalTask / totalUser);
        return {
            totalUser,
            countTaskByStatus,
            averageTaskPerUser,
        };
    }

    static async getUserTaskStats(page: number, pageSize: number, sort: string): Promise<IAdminStat> {
        let sortQuery = {};
        if (sort === 'asc') {
            sortQuery = { totalTask: 1 };
        } else if (sort === 'desc') {
            sortQuery = { totalTask: -1 };
        } else {
            sortQuery = {};
        }
        console.time('=====>');
        const [totalUser, result] = await Promise.all([
            this.userRepository.count({ where: { isAdmin: false } }),
            TaskStatistic.find()
                .sort(sortQuery)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean(),
        ]);
        const userIds = result.map((user) => user.userId);
        const users = await this.userRepository.find({
            select: ['id', 'name', 'email'],
            where: {
                id: In(userIds),
            },
        });
        const userObject = Object.fromEntries(users.map((user) => [user.id, { name: user.name, email: user.email }]));
        const countTaskByUsers: ITaskStatForUser[] = result.map((stat) => {
            const user = userObject[stat.userId];
            return {
                email: user.email,
                name: user.name,
                taskStat: {
                    totalTask: stat.totalTask,
                    todo: stat.todo,
                    progressing: stat.progressing,
                    completed: stat.completed,
                },
            };
        });
        console.timeEnd('=====>');
        return { countTaskByUsers, page, pageSize, totalPages: Math.ceil(totalUser / pageSize) };
    }

    static async getGeneralStats1(): Promise<IGeneralStat> {
        const result = await RedisAdapter.get("general-report", true);  //totalUser, totalTask, taskByStatus
        const countTaskByStatus: IStatusCount = {
            totalTask: result[1][0].totalTask,
            todo: result[1][0].todo,
            progressing: result[1][0].progressing,
            completed: result[1][0].completed
        };
        const averageTaskPerUser = Math.ceil(countTaskByStatus.totalTask / result[0]);
        return {
            totalUser: result[0],
            countTaskByStatus,
            averageTaskPerUser,
        };
    }
    static async getUserTaskStats1(page: number, pageSize: number, sort: string): Promise<IAdminStat> {
        let sortQuery = {};
        if (sort === 'asc') {
            sortQuery = { totalTask: 1 };
        } else if (sort === 'desc') {
            sortQuery = { totalTask: -1 };
        } else {
            sortQuery = {};
        }
        console.time('1=====>');
        const [totalUser, result] = await Promise.all([
                this.userRepository.count({ where: { isAdmin: false } }),
            this.statisticRepository.find({
                order: sortQuery,
                skip: (page - 1)*pageSize,
                take: pageSize, 
            })
        ]);
        console.timeEnd('1=====>');
        console.time('2=====>');
        const userIds = result.map((user) => user.userId);
        const users = await this.userRepository.find({
            select: ['id', 'name', 'email'],
            where: {
                id: In(userIds),
            },
        });
        console.timeEnd('2=====>');
        console.time('3=====>');
        const userObject = Object.fromEntries(users.map((user) => [user.id, { name: user.name, email: user.email }]));
        const countTaskByUsers: ITaskStatForUser[] = result.map((stat) => {
            const user = userObject[stat.userId];
            return {
                email: user.email,
                name: user.name,
                taskStat: {
                    totalTask: stat.totalTask,
                    todo: stat.todo,
                    progressing: stat.progressing,
                    completed: stat.completed,
                },
            };
        });
        console.timeEnd('3=====>');
        return { countTaskByUsers, page, pageSize, totalPages: Math.ceil(totalUser / pageSize) };
    }
    static async test(){
        const stats = await TaskStatistic.find({})
        stats.map(async(stat) => {
            await this.statisticRepository.save(stat);
        })

        // const countTaskByUsers: ITaskStatForUser1[] =  await Promise.all(users.map(async (user) => {
        //     const stat = await TaskStatistic.findOne({userId: user.id})
        //     return {
        //         email: user.email,
        //         name: user.name,
        //         totalTask: stat.totalTask,
        //         todo: stat.todo,
        //         progressing: stat.progressing,
        //         completed: stat.completed,
        //     };
        // }));
        // console.log("====>")
        // await this.statisticRepository.insert(stats);
    }
    // static async test1(page: number, pageSize: number, sort: string): Promise<IUsersTaskStats> {
    //     let sortQuery = {};
    //     if (sort === 'asc') {
    //         sortQuery = { totalTask: 1 };
    //     } else if (sort === 'desc') {
    //         sortQuery = { totalTask: -1 };
    //     } else {
    //         sortQuery = {};
    //     }
    //     console.time('=====>');
    //     const [totalUser, result] = await Promise.all([
    //         this.userRepository.count({ where: { isAdmin: false } }),
    //         TaskStatistic.find()
    //             .sort(sortQuery)
    //             .skip((page - 1) * pageSize)
    //             .limit(pageSize),
    //     ]);
    //     const userIds = result.map((user) => user.userId);
    //     const users = await this.userRepository.find({
    //         select: ['id', 'name', 'email'],
    //         where: {
    //             isAdmin: false,
    //             id: In(userIds),
    //         },
    //     });
    //     const countTaskByUsers: ICountTaskByUser[] = result.map((stat) => {
    //         const user = users.find((u) => u.id === stat.userId);
    //         const countTaskByStatus: ICountTaskByStatus[] = [
    //             { status: "todo", count: stat.todo },
    //             { status: "progressing", count: stat.progressing },
    //             { status: "completed", count: stat.completed },
    //         ];

    //         return {
    //             email: user.email,
    //             name: user.name,
    //             taskStat: {
    //                 totalTask: stat.totalTask,
    //                 countTaskByStatus,
    //             },
    //         };
    //     });
    //     // const tmp = await Task.aggregate([
    //     //     {
    //     //         $group: {
    //     //             _id: "$userId", // Nhóm theo userId
    //     //             totalTask: { $sum: 1 }, // Đếm tổng số task
    //     //             todo: { $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] } }, // Đếm task có status "todo"
    //     //             progressing: { $sum: { $cond: [{ $eq: ["$status", "progressing"] }, 1, 0] } }, // Đếm task có status "progressing"
    //     //             completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, // Đếm task có status "completed"
    //     //         },
    //     //     },
    //     //     {
    //     //         $project: {
    //     //             _id: 0, // Loại bỏ _id khỏi kết quả
    //     //             userId: "$_id", // Thêm userId từ _id
    //     //             totalTask: 1,
    //     //             todo: 1,
    //     //             progressing: 1,
    //     //             completed: 1,
    //     //         },
    //     //     },
    //     // ]);

    //     // await TaskStatistic.insertMany(tmp)
    //     console.timeEnd('=====>');
    //     return { countTaskByUsers, page, pageSize, totalPages: Math.ceil(totalUser / pageSize) };
    // }
}

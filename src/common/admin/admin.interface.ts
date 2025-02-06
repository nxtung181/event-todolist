export interface ICountTaskByStatus{
    status: string,
    count: number
}

export interface ITaskUserStat{
    totalTask: number,
    countTaskByStatus: ICountTaskByStatus[]
}
export interface ICountTaskByUser{
    email: string,
    name: string,
    taskStat: ITaskUserStat
}
export interface IUsersTaskStats{
    countTaskByUsers: ICountTaskByUser[],
    page: number,
    pageSize: number,
    totalPages: number
}
export interface ITest{
    userId: string,
    totalTask: number,
    statusCounts: object
}
export enum TaskStatus {
    Progressing = 'progressing',
    Completed = 'completed',
    Todo = 'todo',
}
export interface IGeneralStat{
    totalUser: number,
    countTaskByStatus: IStatusCount,
    averageTaskPerUser: number
}
export interface IStatusCount{
    totalTask: number
    todo: number,
    progressing: number,
    completed: number
}
export interface ITaskStatForUser{
    email: string,
    name: string,
    taskStat: IStatusCount
}

export interface IAdminStat {
    countTaskByUsers: ITaskStatForUser[],
    page: number,
    pageSize: number,
    totalPages: number
}

export interface ITaskStatForUser1{
    email: string,
    name: string,
    totalTask: number
    todo: number,
    progressing: number,
    completed: number
}
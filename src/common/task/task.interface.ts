import mongoose from "mongoose";

export interface ITaskPagination {
    page: number,
    pageSize: number
}

export interface ITaskMany {
    title: string;
    content: string;
    status: string;
    userId: string;
}

export interface ITask{
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    status: string;
    userId: string;
}

export interface ITaskEdit{
    userId: string;
    oldStatus: string;
    newStatus: string;
}

export interface ITaskRes{
    tasks: ITask[],
    page: number,
    pageSize: number,
    totalPage: number
}
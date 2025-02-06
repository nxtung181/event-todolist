import { ITimestamp } from '@common/timestamp.interface';
import mongoose, { Schema, Types } from 'mongoose';

export interface ITaskStatistic extends Document, ITimestamp {
    _id: Types.ObjectId;
    userId: string;
    totalTask: number;
    todo: number;
    progressing: number;
    completed: number;
}

const TaskStatSchema: Schema<ITaskStatistic> = new Schema(
    {
        userId: { type: String, required: true },
        totalTask: { type: Number, default: 0 },
        todo: {type: Number, default: 0 },
        progressing: {type: Number, default: 0},
        completed: {type: Number, default: 0}
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export default mongoose.model<ITaskStatistic>('TaskStat', TaskStatSchema);

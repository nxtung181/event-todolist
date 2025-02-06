import { ITimestamp } from '@common/timestamp.interface';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskShare extends Document, ITimestamp {
    _id: mongoose.Types.ObjectId;
    taskId: { type: mongoose.Types.ObjectId, ref: "Task" },
    sharedWith: string[]    
}

const TaskShareSchema: Schema<ITaskShare> = new Schema(
    {
        taskId: { type: mongoose.Types.ObjectId, ref: "Task" },
        sharedWith: [{type: String, require: true}] 
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export default mongoose.model<ITaskShare>('TaskShare', TaskShareSchema);


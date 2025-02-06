import { ITimestamp } from '@common/timestamp.interface';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskResponse {
    id: string;
    title: string;
    content: string;
    status: string;
    userId: string;
}

export interface ITask extends Document, ITimestamp {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    status: string;
    userId: string;

    transform(): ITaskResponse;
}

const TaskSchema: Schema<ITask> = new Schema(
    {
        title: { type: String, trim: true, required: true },
        content: {type: String, required: true},
        status: {type: String, enum:['todo', 'completed', 'progressing'], default: 'todo'},
        userId: {type: String, required: true}
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

TaskSchema.method({
    /**
     * Transform Sample object to API response
     *
     * @returns
     */
    transform(): ITaskResponse {
        const transformed: ITaskResponse = {
            id: this._id.toHexString(),
            title: this.title,
            content: this.content,
            status: this.status,
            userId: this.userId
        };

        return transformed;
    },
});

// Export the model and return your ISample interface
export default mongoose.model<ITask>('Task', TaskSchema);

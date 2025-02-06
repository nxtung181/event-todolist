import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskStat {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    totalTask: number;

    @Column()
    progressing: number;

    @Column()
    todo: number;

    @Column()
    completed: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}

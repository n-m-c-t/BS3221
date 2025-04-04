import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()  // auto-incrementing ID
    id: number;

    @Column({ unique: true })
    description: string;

}

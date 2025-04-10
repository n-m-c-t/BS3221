import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Submission } from '../submission/submission.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Submission, (submission) => submission.location, { onDelete: 'CASCADE' })
  submissions: Submission[];
}

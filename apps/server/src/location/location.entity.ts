import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()  // auto-incrementing ID
  id: number;

  @Column({ unique: true })
  name: string;
}

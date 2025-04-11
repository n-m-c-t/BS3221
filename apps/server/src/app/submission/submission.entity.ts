import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Location } from '../location/location.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entryTime: Date;

  @Column({ nullable: true })
  exitTime?: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Location, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'locationId' })
  location: Location;

}

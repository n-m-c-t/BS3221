import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { UpdateSubmissionDto } from './dto/update.submission.dto';
import { User } from '../user/user.entity';
import { Location } from '../location/location.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Location) private locationRepo: Repository<Location>
  ) {}

  async create(createDto: CreateSubmissionDto): Promise<Submission> {
    const user = await this.userRepo.findOne({ where: { id: createDto.userID } });
    const location = await this.locationRepo.findOne({ where: { id: createDto.locationID } });

    if (!user || !location) throw new Error('Invalid user or location');

    const submission = this.submissionRepo.create({
      entryTime: createDto.entryTime,
      exitTime: createDto.exitTime,
      user,
      location,
    });

    return this.submissionRepo.save(submission);
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionRepo.find({ relations: ['user', 'location'] });
  }  

  async findByUser(userID: number): Promise<Submission[]> {
    return this.submissionRepo.find({
      where: { user: { id: userID } },
    });
  }

  async update(id: number, updateDto: UpdateSubmissionDto): Promise<Submission> {
    const submission = await this.submissionRepo.findOne({
      where: { id },
      relations: ['user', 'location'],
    });
  
    if (!submission) throw new Error('Submission not found');
  
    if (updateDto.entryTime) submission.entryTime = updateDto.entryTime;
    if (updateDto.exitTime) submission.exitTime = updateDto.exitTime;
  
    if (updateDto.locationID) {
      const location = await this.locationRepo.findOne({ where: { id: updateDto.locationID } });
      if (!location) throw new Error('Invalid location');
      submission.location = location;
    }
  
    return this.submissionRepo.save(submission);
  }
  
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
  
    if (result.affected === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async deactivateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
  
    user.active = false; // Set active status to false
    return this.userRepository.save(user); // Save the updated user
  }

}

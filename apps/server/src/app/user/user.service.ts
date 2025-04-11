import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
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
  
  async activateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
  
    user.active = true; // Set active status to false
    return this.userRepository.save(user); // Save the updated user
  }

  async updatePassword(id: number, current: string, newPass: string): Promise<string> {
    // const user = await this.userRepository.findOne({ where: { email } });
  
    // if (!user) {
    //   throw new Error('Invalid credentials');
    // }
  
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new Error('Invalid credentials');
    // }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPass, saltRounds);
  
    user.password = hashedNewPassword;
    await this.userRepository.save(user);
  
    return "Password updated";
  }
}
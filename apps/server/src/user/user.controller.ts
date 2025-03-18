import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(Number(id));
  }

  @Patch(':id/deactivate')
  async deactivateUser(@Param('id') id: number): Promise<User> {
    return this.userService.deactivateUser(Number(id));
  }

}

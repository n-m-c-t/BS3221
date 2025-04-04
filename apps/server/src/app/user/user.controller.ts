import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth-guards';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivateUser(@Param('id') id: number): Promise<User> {
    return this.userService.deactivateUser(Number(id));
  }

}

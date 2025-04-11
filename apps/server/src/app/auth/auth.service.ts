import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { first } from 'rxjs';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new Error('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
  
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      active: user.active,
      role: user.role.description,
    };
    
    const accessToken = this.jwtService.sign(payload);
  
    return {
      access_token: accessToken,
    };
  }  
}
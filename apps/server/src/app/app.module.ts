import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';  // Import your User entity
import { UserService } from '../user/user.service'; // Import your User service
import { UserController } from '../user/user.controller'; // Import your User controller
import { Admin } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'mssql' for prod/test
      // host: 'DB_URL',
      host: '127.0.0.1',
      // port: DB_PORT,
      port: 3306,
      // username: 'DB_USER',
      username: 'admin',
      // password: 'DB_PASS',
      password: 'password',
      // database: 'DB_NAME',
      database: 'sys',
      entities: [User],
      synchronize: true, // Set this to false in production
    }),

    TypeOrmModule.forFeature([User]), // Add User to the feature
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class AppModule {}

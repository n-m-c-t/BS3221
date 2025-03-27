  import { Module } from '@nestjs/common';
  // import { AppController } from './app.controller';
  // import { AppService } from './app.service';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { User } from '../user/user.entity';  // Import your User entity
  import { UserService } from '../user/user.service'; // Import your User service
  import { UserController } from '../user/user.controller'; // Import your User controller
  import { Location } from '../location/location.entity';
  import { LocationService } from '../location/location.service';
  import { LocationController } from '../location/location.controller';
  // import { Admin } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'mssql' for prod/test
      // host: 'DB_URL',
      host: '127.0.0.1',
      // port: DB_PORT,
      port: 3306,
      // username: 'DB_USER',
      username: 'root',
      // password: 'DB_PASS',
      password: 'root',
      // database: 'DB_NAME',
      database: 'mydb',
      entities: [User, Location],
      synchronize: true, // Set this to false in production
    }),

      TypeOrmModule.forFeature([User, Location]), // Add User to the feature
    ],
    controllers: [UserController, LocationController],
    providers: [UserService, LocationService],
  })

  export class AppModule {}

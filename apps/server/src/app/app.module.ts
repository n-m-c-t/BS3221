  import { Module } from '@nestjs/common';
  // import { AppController } from './app.controller';
  // import { AppService } from './app.service';
  import { PassportModule } from '@nestjs/passport';
  import { JwtModule} from '@nestjs/jwt';
  import { JwtStrategy } from './strategies/jwt.strategy';
  import { JwtAuthGuard } from './guards/jwt-auth-guards';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { User } from './user/user.entity';  // Import your User entity
  import { Role } from './role/role.entity'; // Import your Role entity
  import { UserService } from './user/user.service'; // Import your User service
  import { UserController } from './user/user.controller'; // Import your User controller
  import { Location } from './location/location.entity';
  import { LocationService } from './location/location.service';
  import { LocationController } from './location/location.controller';
  import { Submission } from './submission/submission.entity';
  import { SubmissionController } from './submission/submission.controller';
  import { SubmissionService } from './submission/submission.service';
  import { AuthController } from './auth/auth.controller';
  import { AuthService } from './auth/auth.service';
  // import { Admin } from 'typeorm';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1h' },}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bs3221-mysql-server.mysql.database.azure.com',
      port: 3306,
      username: 'azureAdminUser',
      password: 'QKs9GQmo1x2uqVgkMAcg',
      database: 'bs3221database',
      entities: [User, Role, Location, Submission],
      synchronize: false,  // keep false in production
    }),

      TypeOrmModule.forFeature([User, Role, Location, Submission]),
    ],
    controllers: [UserController, LocationController, SubmissionController, AuthController],
    providers: [UserService, LocationService, SubmissionService, JwtStrategy, JwtAuthGuard, AuthService],
  })

  export class AppModule {}

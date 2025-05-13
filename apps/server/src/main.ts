import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Read your allowed origin(s) from an env var
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:4200';
  // const frontendUrl = 'https://bs3221-webapp-b5cxb7fkeghwgafx.uksouth-01.azurewebsites.net/:80';

  // const allowedOrigin = 'https://bs3221-reverse-proxy.greenwater-a485c573.uksouth.azurecontainerapps.io/';

  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = 3000;
  await app.listen(port);
  
  Logger.log(`🚀 Backend is running at http://https://bs3221-reverse-proxy.greenwater-a485c573.uksouth.azurecontainerapps.io/:${port}/api`);
  // Logger.log(`🌐 CORS allowed origin: ${allowedOrigin}`);
}

bootstrap();

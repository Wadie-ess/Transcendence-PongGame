// load .env file into process.env
import * as dotenv from 'dotenv';
dotenv.config();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from './exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://142.93.161.63/',
      'http://164.92.243.105/',
    ],
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(passport.initialize());
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  await app.listen(3001);
}
bootstrap();

// load .env file into process.env
import * as dotenv from 'dotenv';
dotenv.config();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from './exceptions/exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayAdapter } from './gateways/gateway-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://142.93.161.63',
      'http://164.92.243.105',
    ],
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(passport.initialize());
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useWebSocketAdapter(new GatewayAdapter());

  const options = new DocumentBuilder()
    .setTitle('Transcendence Api')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('profile')
    .addTag('friends')
    .addTag('rooms')
    .addTag('Messages')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();

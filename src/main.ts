import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());// 
  app.enableCors({
    // origin:"*"
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
   
   
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true,            // Automatically transform payloads to DTO instances
  }));
  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
}
bootstrap();

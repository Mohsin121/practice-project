import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());// 
  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AuthenticatedSocketAdapter } from './modules/socket/socket.adaptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // // Log all incoming requests
  // app.use((req, res, next) => {
  //   console.log(`📨 ${req.method} ${req.url}`);
  //   console.log('Headers:', req.headers);
  //   console.log('Body:', req.body);
  //   next();
  // });
  
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    // origin: "*",  // Allow all origins for testing
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
   
   
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true,            // Automatically transform payloads to DTO instances
  }));
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));


  await app.listen(process.env.PORT ?? 8000);
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
    transform: true, // Automatically transform payloads to DTO instances
    // forbidNonWhitelisted: true, // Optional: Throw error if non-whitelisted properties are present
  }));

  // Enable CORS for the frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies/authorization headers
  });

  // Define the port, defaulting to 3001 to avoid conflict with frontend (usually 3000)
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend application is running on: http://localhost:${port}`); // Log the port
}
bootstrap();

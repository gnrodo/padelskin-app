import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { MongooseModule } from '@nestjs/mongoose';
// import { JwtModule } from '@nestjs/jwt'; // Removed JWT Module import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClubsModule } from './clubs/clubs.module';
import { CourtsModule } from './courts/courts.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // Configure ConfigModule
      isGlobal: true, // Make ConfigService available globally
    }),
    MongooseModule.forRootAsync({ // Configure MongooseModule asynchronously
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), // Get URI from .env
        // Add other Mongoose options here if needed
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),
    UsersModule,
    // JwtModule configuration removed
    AuthModule,
    ClubsModule,
    CourtsModule,
    SchedulesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

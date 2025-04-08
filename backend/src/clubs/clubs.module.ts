import { Module } from '@nestjs/common'; // Combined imports
import { MongooseModule } from '@nestjs/mongoose'; // Combined imports
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { Club, ClubSchema } from './entities/club.entity';
import { SchedulesModule } from '../schedules/schedules.module'; // Import SchedulesModule
import { CourtsModule } from '../courts/courts.module'; // Import CourtsModule
import { BookingsModule } from '../bookings/bookings.module'; // Import BookingsModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
    // Import other modules needed by ClubsService
    SchedulesModule,
    CourtsModule,
    BookingsModule,
    // Use forwardRef if circular dependencies arise, e.g., forwardRef(() => UsersModule)
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService], // Export ClubsService
})
export class ClubsModule {}

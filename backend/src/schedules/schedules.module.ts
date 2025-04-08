import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule, ScheduleSchema } from './entities/schedule.entity'; // Import Schedule and ScheduleSchema

@Module({
  imports: [
    // Add imports array
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]), // Register Schedule schema
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService], // Export SchedulesService
})
export class SchedulesModule {}

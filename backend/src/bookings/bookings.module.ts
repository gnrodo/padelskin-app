import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './entities/booking.entity'; // Import Booking and BookingSchema

@Module({
  imports: [
    // Add imports array
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]), // Register Booking schema
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService], // Export BookingsService
})
export class BookingsModule {}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from './entities/booking.entity';
// TODO: Import SchedulesService, CourtsService, UsersService for validation/calculation

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    // TODO: Inject other services: SchedulesService, CourtsService, UsersService
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    // TODO: Validate club and court existence using their respective services

    // --- Calculate endTime based on startTime and schedule ---
    // TODO: Fetch schedule for the club to get slotDurationMinutes
    const slotDurationMinutes = 90; // Placeholder
    const startTime = new Date(createBookingDto.startTime);
    if (isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid startTime format.');
    }
    const endTime = new Date(startTime.getTime() + slotDurationMinutes * 60000);

    // --- Check for booking conflicts ---
    const conflictingBooking = await this.findBookingConflict(
      createBookingDto.court,
      startTime,
      endTime,
    );
    if (conflictingBooking) {
      throw new ConflictException(
        `Court is already booked from ${conflictingBooking.startTime.toLocaleTimeString()} to ${conflictingBooking.endTime.toLocaleTimeString()}`,
      );
    }

    // TODO: Validate if the startTime aligns with the club's schedule (open hours, slot start times)

    // TODO: Calculate price based on schedule/court/time

    const createdBooking = new this.bookingModel({
      ...createBookingDto,
      user: new Types.ObjectId(userId), // Assign the authenticated user ID
      startTime, // Use the Date object
      endTime, // Use the calculated Date object
      status: createBookingDto.status ?? BookingStatus.PENDING_PAYMENT, // Default status
      players: [new Types.ObjectId(userId)], // Add booker to players list initially
      // price: calculatedPrice, // Use calculated price
    });

    return createdBooking.save();
  }

  async findAll(
    clubId?: string,
    courtId?: string,
    userId?: string,
    date?: string, // e.g., "YYYY-MM-DD"
  ): Promise<Booking[]> {
    const filter: Record<string, unknown> = {};
    if (clubId) filter.club = new Types.ObjectId(clubId);
    if (courtId) filter.court = new Types.ObjectId(courtId);
    if (userId) filter.user = new Types.ObjectId(userId);
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: startOfDay, $lt: endOfDay };
    }

    return this.bookingModel
      .find(filter)
      .populate('user', 'name email')
      .populate('club', 'name slug')
      .populate('court', 'name type')
      .sort({ startTime: 1 }) // Sort by start time
      .exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('user', 'name email')
      .populate('club', 'name slug')
      .populate('court', 'name type')
      .populate('players', 'name email') // Populate players details
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    // Basic update, more complex logic needed for status changes, adding/removing players etc.
    if (
      updateBookingDto.club ||
      updateBookingDto.court ||
      updateBookingDto.startTime
    ) {
      throw new BadRequestException(
        'Cannot update club, court, or startTime via this method.',
      );
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .populate('user', 'name email')
      .populate('club', 'name slug')
      .populate('court', 'name type')
      .populate('players', 'name email')
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return updatedBooking;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    // Consider changing status to CANCELLED instead of deleting?
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }

  // Helper to check for overlapping bookings
  private async findBookingConflict(
    courtId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<BookingDocument | null> {
    return this.bookingModel
      .findOne({
        court: new Types.ObjectId(courtId),
        status: { $ne: BookingStatus.CANCELLED_BY_ADMIN }, // Ignore cancelled bookings for conflicts
        $or: [
          // New booking starts during an existing booking
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      })
      .exec();
  }

  // --- Helper for Availability ---
  async findBookingsForCourtsOnDate(
    courtIds: string[],
    dateString: string,
  ): Promise<BookingDocument[]> {
    const startOfDay = new Date(dateString + 'T00:00:00.000Z');
    const endOfDay = new Date(dateString + 'T23:59:59.999Z');

    return (
      this.bookingModel
        .find({
          court: { $in: courtIds.map((id) => new Types.ObjectId(id)) }, // Find bookings for the specified courts
          status: { $ne: BookingStatus.CANCELLED_BY_ADMIN }, // Ignore cancelled bookings
          // Find bookings that overlap with the target date
          $or: [
            { startTime: { $gte: startOfDay, $lt: endOfDay } }, // Starts within the day
            { endTime: { $gt: startOfDay, $lte: endOfDay } }, // Ends within the day
            { startTime: { $lt: startOfDay }, endTime: { $gt: endOfDay } }, // Spans the entire day
          ],
        })
        // Optionally populate necessary fields if needed later, but maybe not for availability check
        // .populate('court')
        .exec()
    );
  }
}

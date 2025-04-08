import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club, ClubDocument } from './entities/club.entity';
import { SchedulesService } from '../schedules/schedules.service'; // Import SchedulesService
import { CourtsService } from '../courts/courts.service'; // Import CourtsService
import { BookingsService } from '../bookings/bookings.service'; // Import BookingsService
import { BookingDocument } from '../bookings/entities/booking.entity'; // Import BookingDocument for type hint
import { CourtDocument } from '../courts/entities/court.entity'; // Import CourtDocument for type hint

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    // Use forwardRef if circular dependency with SchedulesService arises (if SchedulesService needs ClubsService)
    // For now, direct injection should work as ClubsModule imports SchedulesModule etc.
    private readonly schedulesService: SchedulesService,
    private readonly courtsService: CourtsService,
    private readonly bookingsService: BookingsService,
    // TODO: Inject UsersService if needed for admin validation
  ) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    // Check if slug already exists
    const existingClub = await this.clubModel
      .findOne({ slug: createClubDto.slug })
      .exec();
    if (existingClub) {
      throw new BadRequestException(
        `Club slug "${createClubDto.slug}" already exists.`,
      );
    }

    // TODO: Validate that the provided admin user ID exists and has the correct role (e.g., ADMIN)
    // This would require injecting UsersService

    const createdClub = new this.clubModel(createClubDto);
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().populate('admin', 'name email').exec(); // Populate admin name/email
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubModel
      .findById(id)
      .populate('admin', 'name email')
      .exec();
    if (!club) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
    return club;
  }

  async findOneBySlug(slug: string): Promise<Club> {
    const club = await this.clubModel
      .findOne({ slug })
      .populate('admin', 'name email')
      .exec();
    if (!club) {
      throw new NotFoundException(`Club with slug "${slug}" not found`);
    }
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club> {
    // If slug is being updated, check for uniqueness
    if (updateClubDto.slug) {
      const existingClub = await this.clubModel
        .findOne({ slug: updateClubDto.slug, _id: { $ne: id } })
        .exec();
      if (existingClub) {
        throw new BadRequestException(
          `Club slug "${updateClubDto.slug}" already exists.`,
        );
      }
    }

    const updatedClub = await this.clubModel
      .findByIdAndUpdate(id, updateClubDto, { new: true }) // {new: true} returns the updated document
      .populate('admin', 'name email')
      .exec();

    if (!updatedClub) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
    return updatedClub;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.clubModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Club with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }

  // --- Availability Logic ---
  async getAvailability(
    clubId: string,
    dateString: string,
  ): Promise<{
    clubId: string;
    date: string;
    courts: {
      courtId: string;
      courtName: string;
      courtType: string;
      availableSlots: string[];
    }[];
  }> {
    // 1. Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }
    const targetDate = new Date(dateString + 'T00:00:00.000Z');
    const dayOfWeek = targetDate.getUTCDay();

    // 2. Get Club's Schedule
    interface ScheduleData {
      weeklyHours?: Array<{
        dayOfWeek: number;
        isOpen: boolean;
        openTime: string;
        closeTime: string;
        slotDurationMinutes: number;
      }>;
    }

    let schedule: ScheduleData;
    try {
      schedule = (await this.schedulesService.findOneByClub(
        clubId,
      )) as ScheduleData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.warn(`Schedule not found for club ${clubId}`);
        return { clubId, date: dateString, courts: [] };
      }
      throw error;
    }

    const weeklyHours = schedule?.weeklyHours || [];
    const dailySchedule = weeklyHours.find((h) => h?.dayOfWeek === dayOfWeek);
    if (
      !dailySchedule ||
      !dailySchedule.isOpen ||
      !dailySchedule.openTime ||
      !dailySchedule.closeTime ||
      !dailySchedule.slotDurationMinutes
    ) {
      console.warn(
        `Club ${clubId} is closed or schedule incomplete for day ${dayOfWeek}`,
      );
      return { clubId, date: dateString, courts: [] };
    }

    // 3. Get Active Courts
    // Use CourtDocument[] type hint for the result of findAll
    const courts: CourtDocument[] = await this.courtsService.findAll(clubId);
    const activeCourts = courts.filter((c) => c.isActive);
    if (activeCourts.length === 0) {
      console.warn(`No active courts found for club ${clubId}`);
      return { clubId, date: dateString, courts: [] };
    }

    // 4. Get Bookings for these courts on the target date
    const courtIds = activeCourts.map((c) => c._id.toString()); // Access _id safely now
    // Assuming findBookingsForCourtsOnDate exists and returns BookingDocument[]
    const bookings = await this.bookingsService.findBookingsForCourtsOnDate(
      courtIds,
      dateString,
    );

    // 5. Calculate Availability
    const availabilityResult = activeCourts.map((court) => {
      // Filter bookings specific to this court
      const courtBookings = bookings.filter((b) => {
        // Check if b.court is populated and has _id, or if it's just an ObjectId
        const courtIdInBooking =
          b.court instanceof Model ? (b.court as CourtDocument)._id : b.court;

        if (!courtIdInBooking) return false;

        let bookingIdStr = '';
        if (courtIdInBooking) {
          if (
            typeof courtIdInBooking === 'object' &&
            '_id' in courtIdInBooking
          ) {
            bookingIdStr = courtIdInBooking._id.toString();
          } else if (typeof courtIdInBooking.toString === 'function') {
            try {
              if (
                typeof courtIdInBooking === 'object' &&
                courtIdInBooking !== null
              ) {
                bookingIdStr = JSON.stringify(courtIdInBooking);
              } else {
                bookingIdStr = '';
              }
            } catch {
              bookingIdStr = '';
            }
          }
        }
        const courtIdStr = court._id.toString();
        return bookingIdStr === courtIdStr;
      });

      const openTime =
        dailySchedule && typeof dailySchedule.openTime === 'string'
          ? dailySchedule.openTime
          : '00:00';

      const closeTime =
        dailySchedule && typeof dailySchedule.closeTime === 'string'
          ? dailySchedule.closeTime
          : '23:59';

      const slotDurationMinutes =
        dailySchedule && typeof dailySchedule.slotDurationMinutes === 'number'
          ? dailySchedule.slotDurationMinutes
          : 60;

      const availableSlots = this.calculateAvailableSlots(
        targetDate,
        String(openTime),
        String(closeTime),
        Number(slotDurationMinutes),
        courtBookings, // Pass filtered bookings
      );
      return {
        courtId: court._id.toString(), // Access _id safely
        courtName: court.name,
        courtType: court.type,
        availableSlots: availableSlots,
      };
    });

    return { clubId, date: dateString, courts: availabilityResult };
  }

  private calculateAvailableSlots(
    targetDate: Date,
    openTime: string,
    closeTime: string,
    slotDurationMinutes: number,
    bookings: BookingDocument[],
  ): string[] {
    const slots: string[] = [];
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const startDateTime = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        openHour,
        openMinute,
      ),
    );
    const closeDateTime = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        closeHour,
        closeMinute,
      ),
    );

    let currentSlotStart = new Date(startDateTime);

    while (currentSlotStart.getTime() < closeDateTime.getTime()) {
      const currentSlotEnd = new Date(
        currentSlotStart.getTime() + slotDurationMinutes * 60000,
      );

      if (currentSlotEnd.getTime() > closeDateTime.getTime()) {
        break;
      }

      const isBooked = bookings.some((booking) => {
        // Ensure booking times are valid Date objects
        const bookingStartTime =
          booking.startTime instanceof Date
            ? booking.startTime.getTime()
            : new Date(booking.startTime).getTime();
        const bookingEndTime =
          booking.endTime instanceof Date
            ? booking.endTime.getTime()
            : new Date(booking.endTime).getTime();
        // Check for overlap: (SlotStart < BookingEnd) and (SlotEnd > BookingStart)
        return (
          currentSlotStart.getTime() < bookingEndTime &&
          currentSlotEnd.getTime() > bookingStartTime
        );
      });

      if (!isBooked) {
        const hours = currentSlotStart
          .getUTCHours()
          .toString()
          .padStart(2, '0');
        const minutes = currentSlotStart
          .getUTCMinutes()
          .toString()
          .padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
      }
      currentSlotStart = currentSlotEnd;
    }
    return slots;
  }
}

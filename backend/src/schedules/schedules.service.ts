import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleDocument } from './entities/schedule.entity';
// TODO: Import ClubsService if validation for club existence is needed

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    // TODO: Inject ClubsService if needed
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // Check if a schedule already exists for this club
    const existingSchedule = await this.scheduleModel
      .findOne({ club: createScheduleDto.club })
      .exec();
    if (existingSchedule) {
      throw new BadRequestException(
        `Schedule already exists for club ID "${createScheduleDto.club}". Use update instead.`,
      );
    }

    // TODO: Validate that the provided club ID exists using ClubsService
    // const clubExists = await this.clubsService.findOne(createScheduleDto.club);
    // if (!clubExists) {
    //   throw new BadRequestException(`Club with ID "${createScheduleDto.club}" not found.`);
    // }

    // TODO: Add more validation for weeklyHours array (e.g., ensure 7 unique days, times are logical)

    const createdSchedule = new this.scheduleModel(createScheduleDto);
    return createdSchedule.save();
  }

  async findAll(clubId?: string): Promise<Schedule[]> {
    const filter = clubId ? { club: clubId } : {};
    return this.scheduleModel.find(filter).populate('club', 'name slug').exec();
  }

  // Find schedule by its own ID
  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('club', 'name slug')
      .exec();
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID "${id}" not found`);
    }
    return schedule;
  }

  // Find schedule by Club ID (as we assume one schedule per club for now)
  async findOneByClub(clubId: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findOne({ club: clubId })
      .populate('club', 'name slug')
      .exec();
    if (!schedule) {
      // Consider creating a default schedule if not found, or throwing error
      throw new NotFoundException(`Schedule for club ID "${clubId}" not found`);
    }
    return schedule;
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    // Prevent changing the club via this method
    if (updateScheduleDto.club) {
      throw new BadRequestException(
        'Changing the club of a schedule is not allowed via update.',
      );
    }

    // TODO: Add validation for weeklyHours if provided

    const updatedSchedule = await this.scheduleModel
      .findByIdAndUpdate(id, updateScheduleDto, { new: true })
      .populate('club', 'name slug')
      .exec();

    if (!updatedSchedule) {
      throw new NotFoundException(`Schedule with ID "${id}" not found`);
    }
    return updatedSchedule;
  }

  // Usually schedules are updated, not deleted, but provide remove for completeness
  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.scheduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Schedule with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }
}
